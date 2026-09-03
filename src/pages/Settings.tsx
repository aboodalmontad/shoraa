import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Download, Upload, Shield, Bell, User, Database, Trash2 } from 'lucide-react';

export function Settings() {
  const { clients, cases, sessions, tasks, accounting } = useApp();

  const handleExport = () => {
    const data = {
      clients: clients.data,
      cases: cases.data,
      sessions: sessions.data,
      tasks: tasks.data,
      accounting: accounting.data,
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `law_office_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        // In a real app, we would use a proper merge logic (upsert)
        // For this demo, we'll just alert that the feature is ready for implementation
        alert('تم قراءة ملف النسخة الاحتياطية بنجاح. سيتم دمج البيانات قريباً.');
        console.log('Imported data:', data);
      } catch (err) {
        alert('خطأ في قراءة الملف. يرجى التأكد من صحة التنسيق.');
      }
    };
    reader.readAsText(file);
  };

  const clearLocalStorage = () => {
    if (confirm('هل أنت متأكد من حذف كافة البيانات المحلية؟ لا يمكن التراجع عن هذا الإجراء.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
        <p className="text-stone-500">إدارة تفضيلات النظام، النسخ الاحتياطي، والأمان.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Backup & Restore */}
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Database size={20} className="text-stone-400" />
            النسخ الاحتياطي والبيانات
          </h2>
          <p className="text-sm text-stone-500">
            يمكنك تحميل نسخة كاملة من بياناتك بصيغة JSON للاحتفاظ بها أو نقلها لجهاز آخر.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleExport}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Download size={18} />
              تصدير نسخة احتياطية (JSON)
            </button>
            <label className="btn-secondary flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={18} />
              استيراد نسخة احتياطية
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button 
              onClick={clearLocalStorage}
              className="flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-bold py-2 transition-colors"
            >
              <Trash2 size={18} />
              مسح كافة البيانات المحلية
            </button>
          </div>
        </div>

        {/* Account & Profile */}
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User size={20} className="text-stone-400" />
            الملف الشخصي
          </h2>
          <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center text-2xl text-white font-bold">
              أ
            </div>
            <div>
              <p className="font-bold text-lg">الأستاذ أحمد نحوي</p>
              <p className="text-sm text-stone-500">محامي لدى المجلس</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">حساب نشط</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-stone-400" />
                <span className="text-sm font-medium">تغيير كلمة المرور</span>
              </div>
              <button className="text-xs font-bold text-stone-900">تعديل</button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-stone-400" />
                <span className="text-sm font-medium">تنبيهات الجلسات</span>
              </div>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full translate-x-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card p-6 bg-stone-50 border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-stone-900">إصدار النظام: v2.0.0 (Vite + React 19)</p>
            <p className="text-xs text-stone-500 mt-1">تم التحديث الأخير بتاريخ: 2026-02-28</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            نظام المزامنة يعمل بشكل طبيعي
          </div>
        </div>
      </div>
    </div>
  );
}
