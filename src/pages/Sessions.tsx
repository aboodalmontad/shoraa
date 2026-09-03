import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Calendar, Clock, User, Trash2, Edit2, MapPin, AlertCircle } from 'lucide-react';
import { Session } from '../types';

export function Sessions() {
  const { sessions, cases } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const getCaseTitle = (caseId: string) => {
    return cases.data.find(c => c.id === caseId)?.title || 'قضية غير معروفة';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sessionData = {
      stage_id: formData.get('case_id') as string, // Using case_id as stage_id for simplicity in this demo
      session_date: formData.get('session_date') as string,
      reason: formData.get('reason') as string,
      judge_name: formData.get('judge_name') as string,
      decision: formData.get('decision') as string,
      is_postponed: formData.get('is_postponed') === 'on',
    };

    if (editingSession) {
      sessions.updateItem(editingSession.id, sessionData);
    } else {
      sessions.addItem({
        id: crypto.randomUUID(),
        ...sessionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
    setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الأجندة والجلسات</h1>
          <p className="text-stone-500">متابعة جلسات المحاكم والمواعيد القضائية.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          إضافة جلسة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.data.sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime()).map((s) => (
          <div key={s.id} className="card p-5 group flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex flex-col items-center justify-center text-stone-600 shrink-0">
                <span className="text-[10px] font-bold uppercase">{new Date(s.session_date).toLocaleString('ar-EG', { month: 'short' })}</span>
                <span className="text-xl font-bold">{new Date(s.session_date).getDate()}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{s.reason}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.is_postponed ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {s.is_postponed ? 'مؤجلة' : 'مجدولة'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(s.session_date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>القاضي: {s.judge_name || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{getCaseTitle(s.stage_id)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingSession(s);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => sessions.deleteItem(s.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sessions.data.length === 0 && (
          <div className="py-20 text-center text-stone-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد جلسات مسجلة حالياً</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingSession ? 'تعديل بيانات الجلسة' : 'إضافة جلسة جديدة'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingSession(null); }} className="text-stone-400 hover:text-stone-900">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">القضية المرتبطة</label>
                <select name="case_id" defaultValue={editingSession?.stage_id} required className="input-field">
                  <option value="">اختر القضية...</option>
                  {cases.data.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">تاريخ ووقت الجلسة</label>
                  <input name="session_date" defaultValue={editingSession?.session_date.slice(0, 16)} type="datetime-local" required className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">اسم القاضي</label>
                  <input name="judge_name" defaultValue={editingSession?.judge_name} className="input-field" placeholder="اختياري..." />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">سبب الجلسة / الإجراء</label>
                <input name="reason" defaultValue={editingSession?.reason} required className="input-field" placeholder="مثلاً: سماع الشهود، تقديم مذكرات..." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">القرار المتخذ (إن وجد)</label>
                <textarea name="decision" defaultValue={editingSession?.decision} className="input-field h-20 resize-none" placeholder="ما تم تقريره في الجلسة..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_postponed" id="is_postponed" defaultChecked={editingSession?.is_postponed} className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
                <label htmlFor="is_postponed" className="text-sm font-bold text-stone-700">هل تم تأجيل الجلسة؟</label>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="btn-primary flex-1">حفظ الجلسة</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingSession(null); }} className="btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
