'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workspace } from '@/hooks/use-workspaces';

interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  // Sauvegarder dans localStorage quand le workspace change
  useEffect(() => {
    if (selectedWorkspace && typeof window !== 'undefined') {
      localStorage.setItem('selectedWorkspaceId', selectedWorkspace.id);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedWorkspaceId');
    }
  }, [selectedWorkspace]);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}
