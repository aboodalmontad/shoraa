import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Phone, Mail, MapPin, Trash2, Edit2 } from 'lucide-react';
import { Client } from '../types';

export function Clients() {
  const { clients } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.data.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      notes: formData.get('notes') as string,
    };

    if (editingClient) {
      clients.updateItem(editingClient.id, clientData);
    } else {
      clients.addItem({
        id: crypto.randomUUID(),
        ...clientData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الموكلين</h1>
          <p className="text-stone-500">إدارة بيانات الموكلين وجهات الاتصال الخاصة بهم.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          إضافة موكل جديد
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input 
          type="text" 
          placeholder="البحث عن موكل بالاسم أو رقم الهاتف..." 
          className="input-field pr-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="card p-6 space-y-4 group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-xl font-bold text-stone-600">
                {client.name.charAt(0)}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingClient(client);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => clients.deleteItem(client.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{client.name}</h3>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Phone size={14} />
                  <span>{client.phone}</span>
                </div>
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Mail size={14} />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <MapPin size={14} />
                    <span>{client.address}</span>
                  </div>
                )}
              </div>
            </div>

            {client.notes && (
              <p className="text-xs text-stone-400 bg-stone-50 p-3 rounded-xl line-clamp-2 italic">
                "{client.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingClient ? 'تعديل بيانات الموكل' : 'إضافة موكل جديد'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingClient(null); }} className="text-stone-400 hover:text-stone-900">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">الاسم الكامل</label>
                <input name="name" defaultValue={editingClient?.name} required className="input-field" placeholder="أدخل اسم الموكل..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">رقم الهاتف</label>
                  <input name="phone" defaultValue={editingClient?.phone} required className="input-field" placeholder="05..." />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">البريد الإلكتروني</label>
                  <input name="email" defaultValue={editingClient?.email} type="email" className="input-field" placeholder="example@mail.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">العنوان</label>
                <input name="address" defaultValue={editingClient?.address} className="input-field" placeholder="العنوان السكني أو المهني..." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">ملاحظات إضافية</label>
                <textarea name="notes" defaultValue={editingClient?.notes} className="input-field h-24 resize-none" placeholder="أي تفاصيل أخرى..." />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="btn-primary flex-1">حفظ البيانات</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingClient(null); }} className="btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
