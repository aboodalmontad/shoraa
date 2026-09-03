import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, CheckSquare, Clock, User, Trash2, Edit2, MapPin, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { AdminTask } from '../types';

export function Tasks() {
  const { tasks } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      task_name: formData.get('task_name') as string,
      due_date: formData.get('due_date') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      assigned_to: formData.get('assigned_to') as string,
      location: formData.get('location') as string,
      is_completed: editingTask?.is_completed || false,
    };

    if (editingTask) {
      tasks.updateItem(editingTask.id, taskData);
    } else {
      tasks.addItem({
        id: crypto.randomUUID(),
        ...taskData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const toggleComplete = (task: AdminTask) => {
    tasks.updateItem(task.id, { is_completed: !task.is_completed });
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
  };

  const priorityLabels = {
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">المهام الإدارية</h1>
          <p className="text-stone-500">إدارة المهام اليومية وتوزيعها على فريق العمل.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          إضافة مهمة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.data.sort((a, b) => {
          if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }).map((t) => (
          <div key={t.id} className={`card p-5 group flex items-center justify-between gap-4 transition-all ${t.is_completed ? 'opacity-60 grayscale-[0.5]' : ''}`}>
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => toggleComplete(t)}
                className={`shrink-0 transition-colors ${t.is_completed ? 'text-emerald-500' : 'text-stone-300 hover:text-stone-400'}`}
              >
                {t.is_completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </button>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold text-lg ${t.is_completed ? 'line-through text-stone-400' : ''}`}>{t.task_name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColors[t.priority]}`}>
                    {priorityLabels[t.priority]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(t.due_date).toLocaleDateString('ar-EG')}</span>
                  </div>
                  {t.assigned_to && (
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>المكلف: {t.assigned_to}</span>
                    </div>
                  )}
                  {t.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>المكان: {t.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
                className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => tasks.deleteItem(t.id)}
                className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {tasks.data.length === 0 && (
          <div className="py-20 text-center text-stone-400">
            <CheckSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد مهام حالياً</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingTask(null); }} className="text-stone-400 hover:text-stone-900">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">وصف المهمة</label>
                <input name="task_name" defaultValue={editingTask?.task_name} required className="input-field" placeholder="ما الذي يجب القيام به؟" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">تاريخ الاستحقاق</label>
                  <input name="due_date" defaultValue={editingTask?.due_date.slice(0, 10)} type="date" required className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">الأولوية</label>
                  <select name="priority" defaultValue={editingTask?.priority || 'medium'} className="input-field">
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">المكلف بالمهمة</label>
                  <input name="assigned_to" defaultValue={editingTask?.assigned_to} className="input-field" placeholder="اسم المساعد..." />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">المكان</label>
                  <input name="location" defaultValue={editingTask?.location} className="input-field" placeholder="المحكمة، المكتب..." />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="btn-primary flex-1">حفظ المهمة</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingTask(null); }} className="btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
