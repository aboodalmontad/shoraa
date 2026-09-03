import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  Wallet, 
  Settings,
  Cloud,
  CloudOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
  { path: '/clients', label: 'الموكلين', icon: Users },
  { path: '/cases', label: 'القضايا', icon: Briefcase },
  { path: '/sessions', label: 'الجلسات', icon: Calendar },
  { path: '/tasks', label: 'المهام', icon: CheckSquare },
  { path: '/accounting', label: 'المحاسبة', icon: Wallet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { clients } = useApp(); // Just to check online status from one hook

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-l border-stone-200 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-stone-100">
          <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white font-bold">
            ⚖️
          </div>
          <h1 className="font-bold text-lg">مكتب المحامي</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive 
                    ? "bg-stone-900 text-white shadow-md" 
                    : "text-stone-600 hover:bg-stone-100"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center justify-between px-4 py-2 text-xs font-medium text-stone-500">
            <span>حالة المزامنة</span>
            {clients.isOnline ? (
              <Cloud size={16} className="text-emerald-500" />
            ) : (
              <CloudOff size={16} className="text-rose-500" />
            )}
          </div>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-100 transition-all"
          >
            <Settings size={20} />
            <span className="font-medium">الإعدادات</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        <header className="md:hidden p-4 bg-white border-b border-stone-200 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <h1 className="font-bold">مكتب المحامي</h1>
          </div>
          {clients.isOnline ? (
            <Cloud size={20} className="text-emerald-500" />
          ) : (
            <CloudOff size={20} className="text-rose-500" />
          )}
        </header>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around p-2 z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                isActive ? "text-stone-900" : "text-stone-400"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
