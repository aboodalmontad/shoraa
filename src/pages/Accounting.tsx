import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2, Edit2, Calendar, Briefcase, AlertCircle } from 'lucide-react';
import { AccountingEntry } from '../types';

export function Accounting() {
  const { accounting, cases } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AccountingEntry | null>(null);

  const getCaseTitle = (caseId?: string) => {
    if (!caseId) return 'عام';
    return cases.data.find(c => c.id === caseId)?.title || 'قضية غير معروفة';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const entryData = {
      case_id: formData.get('case_id') as string || undefined,
      type: formData.get('type') as 'income' | 'expense',
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      entry_date: formData.get('entry_date') as string,
    };

    if (editingEntry) {
      accounting.updateItem(editingEntry.id, entryData);
    } else {
      accounting.addItem({
        id: crypto.randomUUID(),
        ...entryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const totalIncome = accounting.data.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = accounting.data.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">المحاسبة والمالية</h1>
          <p className="text-stone-500">تتبع الدخل والمصاريف والاتعاب القضائية.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          إضافة قيد مالي
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-emerald-50 border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-600 font-bold text-sm uppercase">إجمالي الدخل</span>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-700">{totalIncome.toLocaleString()} د.ج</p>
        </div>
        <div className="card p-6 bg-rose-50 border-rose-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-rose-600 font-bold text-sm uppercase">إجمالي المصاريف</span>
            <TrendingDown size={20} className="text-rose-500" />
          </div>
          <p className="text-3xl font-bold text-rose-700">{totalExpenses.toLocaleString()} د.ج</p>
        </div>
        <div className="card p-6 bg-stone-900 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-400 font-bold text-sm uppercase">صافي الرصيد</span>
            <Wallet size={20} className="text-stone-400" />
          </div>
          <p className="text-3xl font-bold">{balance.toLocaleString()} د.ج</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 font-bold text-stone-600">التاريخ</th>
                <th className="px-6 py-4 font-bold text-stone-600">البيان</th>
                <th className="px-6 py-4 font-bold text-stone-600">القضية</th>
                <th className="px-6 py-4 font-bold text-stone-600">النوع</th>
                <th className="px-6 py-4 font-bold text-stone-600">المبلغ</th>
                <th className="px-6 py-4 font-bold text-stone-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {accounting.data.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()).map((entry) => (
                <tr key={entry.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-stone-500">{new Date(entry.entry_date).toLocaleDateString('ar-EG')}</td>
                  <td className="px-6 py-4 font-medium">{entry.description}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{getCaseTitle(entry.case_id)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${entry.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {entry.type === 'income' ? 'دخل' : 'مصروف'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {entry.type === 'income' ? '+' : '-'}{entry.amount.toLocaleString()} د.ج
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingEntry(entry); setIsModalOpen(true); }} className="p-1 text-stone-400 hover:text-stone-900"><Edit2 size={16} /></button>
                      <button onClick={() => accounting.deleteItem(entry.id)} className="p-1 text-stone-400 hover:text-rose-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {accounting.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">لا توجد قيود مالية مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingEntry ? 'تعديل القيد المالي' : 'إضافة قيد مالي جديد'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingEntry(null); }} className="text-stone-400 hover:text-stone-900">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">نوع العملية</label>
                  <select name="type" defaultValue={editingEntry?.type || 'income'} className="input-field">
                    <option value="income">دخل (أتعاب، دفعات...)</option>
                    <option value="expense">مصروف (رسوم، كراء، لوازم...)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">المبلغ (د.ج)</label>
                  <input name="amount" defaultValue={editingEntry?.amount} type="number" required className="input-field" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">البيان / الوصف</label>
                <input name="description" defaultValue={editingEntry?.description} required className="input-field" placeholder="مثلاً: دفعة أولى من أتعاب قضية..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">التاريخ</label>
                  <input name="entry_date" defaultValue={editingEntry?.entry_date.slice(0, 10) || new Date().toISOString().slice(0, 10)} type="date" required className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">القضية المرتبطة</label>
                  <select name="case_id" defaultValue={editingEntry?.case_id} className="input-field">
                    <option value="">عام (غير مرتبطة بقضية)</option>
                    {cases.data.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="btn-primary flex-1">حفظ القيد</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingEntry(null); }} className="btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
