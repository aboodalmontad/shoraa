import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Briefcase, User, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Case } from '../types';

export function Cases() {
  const { cases, clients } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const filteredCases = cases.data.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getClientName = (clientId: string) => {
    return clients.data.find(c => c.id === clientId)?.name || 'غير معروف';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const caseData = {
      client_id: formData.get('client_id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      financial_agreement: Number(formData.get('financial_agreement')),
      status: formData.get('status') as 'active' | 'closed' | 'pending',
    };

    if (editingCase) {
      cases.updateItem(editingCase.id, caseData);
    } else {
      cases.addItem({
        id: crypto.randomUUID(),
        ...caseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
    setEditingCase(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">القضايا</h1>
          <p className="text-stone-500">إدارة ملفات القضايا والاتفاقيات المالية.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          فتح قضية جديدة
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input 
          type="text" 
          placeholder="البحث عن قضية بالعنوان..." 
          className="input-field pr-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.map((c) => (
          <div key={c.id} className="card p-6 space-y-4 group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{c.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <User size={12} />
                    <span>{getClientName(c.client_id)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingCase(c);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => cases.deleteItem(c.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-[10px] font-bold text-stone-400 uppercase">الاتفاق المالي</p>
                <p className="font-bold text-stone-700">{c.financial_agreement?.toLocaleString() || 0} د.ج</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-[10px] font-bold text-stone-400 uppercase">الحالة</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    c.status === 'active' ? 'bg-emerald-500' : c.status === 'pending' ? 'bg-amber-500' : 'bg-stone-400'
                  )} />
                  <span className="text-sm font-medium">
                    {c.status === 'active' ? 'نشطة' : c.status === 'pending' ? 'معلقة' : 'مغلقة'}
                  </span>
                </div>
              </div>
            </div>

            {c.description && (
              <p className="text-sm text-stone-500 line-clamp-2">{c.description}</p>
            )}
          </div>
        ))}

        {filteredCases.length === 0 && (
          <div className="col-span-full py-20 text-center text-stone-400">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد قضايا مطابقة للبحث</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingCase ? 'تعديل بيانات القضية' : 'فتح قضية جديدة'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingCase(null); }} className="text-stone-400 hover:text-stone-900">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">الموكل</label>
                <select name="client_id" defaultValue={editingCase?.client_id} required className="input-field">
                  <option value="">اختر الموكل...</option>
                  {clients.data.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">عنوان القضية</label>
                <input name="title" defaultValue={editingCase?.title} required className="input-field" placeholder="مثلاً: قضية عقارية ضد..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">الاتفاق المالي (د.ج)</label>
                  <input name="financial_agreement" defaultValue={editingCase?.financial_agreement} type="number" required className="input-field" placeholder="0.00" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">الحالة</label>
                  <select name="status" defaultValue={editingCase?.status || 'active'} className="input-field">
                    <option value="active">نشطة</option>
                    <option value="pending">معلقة</option>
                    <option value="closed">مغلقة</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">وصف مختصر</label>
                <textarea name="description" defaultValue={editingCase?.description} className="input-field h-24 resize-none" placeholder="تفاصيل إضافية عن القضية..." />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="btn-primary flex-1">حفظ القضية</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingCase(null); }} className="btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
