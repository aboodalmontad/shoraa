import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export function Dashboard() {
  const { clients, cases, sessions, accounting } = useApp();

  const stats = [
    { label: 'إجمالي الموكلين', value: clients.data.length, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'القضايا النشطة', value: cases.data.filter(c => c.status === 'active').length, icon: Briefcase, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'جلسات اليوم', value: sessions.data.filter(s => {
      const today = new Date().toISOString().split('T')[0];
      return s.session_date.startsWith(today);
    }).length, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
  ];

  const income = accounting.data
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const expenses = accounting.data
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const chartData = [
    { name: 'الدخل', value: income, color: '#10b981' },
    { name: 'المصروفات', value: expenses, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-stone-500">مرحباً بك مجدداً، إليك نظرة سريعة على مكتبك اليوم.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Summary */}
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-stone-400" />
            الملخص المالي
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">إجمالي الدخل</p>
              <p className="text-2xl font-bold text-emerald-700">{income.toLocaleString()} د.ج</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">إجمالي المصاريف</p>
              <p className="text-2xl font-bold text-rose-700">{expenses.toLocaleString()} د.ج</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock size={20} className="text-stone-400" />
            الجلسات القادمة
          </h2>
          
          <div className="space-y-4">
            {sessions.data.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl border border-stone-100 hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex flex-col items-center justify-center text-stone-600">
                    <span className="text-[10px] font-bold uppercase">{new Date(session.session_date).toLocaleString('ar-EG', { month: 'short' })}</span>
                    <span className="text-sm font-bold">{new Date(session.session_date).getDate()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{session.reason}</p>
                    <p className="text-xs text-stone-500">{session.judge_name || 'لم يحدد القاضي'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${session.is_postponed ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {session.is_postponed ? 'مؤجلة' : 'مجدولة'}
                </div>
              </div>
            ))}
            {sessions.data.length === 0 && (
              <div className="text-center py-12 text-stone-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p>لا توجد جلسات مجدولة حالياً</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
