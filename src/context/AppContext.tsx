import React, { createContext, useContext, ReactNode } from 'react';
import { useSync } from '../hooks/useSync';
import { Client, Case, Session, AdminTask, AccountingEntry } from '../types';

interface AppContextType {
  clients: ReturnType<typeof useSync<Client>>;
  cases: ReturnType<typeof useSync<Case>>;
  sessions: ReturnType<typeof useSync<Session>>;
  tasks: ReturnType<typeof useSync<AdminTask>>;
  accounting: ReturnType<typeof useSync<AccountingEntry>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const clients = useSync<Client>('clients');
  const cases = useSync<Case>('cases');
  const sessions = useSync<Session>('sessions');
  const tasks = useSync<AdminTask>('admin_tasks');
  const accounting = useSync<AccountingEntry>('accounting_entries');

  return (
    <AppContext.Provider value={{ clients, cases, sessions, tasks, accounting }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
