'use client';

import React, { useState } from 'react';
import { useWorkspaces, Workspace } from '@/hooks/use-workspaces';
import { WorkspaceSelector } from '@/components/workspace/workspace-selector';
import { CreateWorkspaceDialog } from '@/components/workspace/create-workspace-dialog';
import { TeamManagement } from '@/components/workspace/team-management';
import { RegistrationNotice } from '@/components/workspace/registration-notice';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Settings, 
  Calendar, 
  BarChart3, 
  FileText,
  Loader2
} from 'lucide-react';

export default function WorkspacesPage() {
  const { workspaces, loading, error } = useWorkspaces();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceContext();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Debug: afficher les workspaces dans la console
  console.log('Workspaces récupérés:', workspaces);
  console.log('État de chargement:', loading);
  console.log('Erreur:', error);

  // Initialiser la sélection du workspace quand les workspaces sont chargés
  React.useEffect(() => {
    console.log('🔍 useEffect workspaces - workspaces:', workspaces.length, 'isInitialized:', isInitialized, 'selectedWorkspace:', !!selectedWorkspace);
    
    if (workspaces.length > 0 && !selectedWorkspace && !isInitialized) {
      console.log('🚀 Initialisation de la sélection du workspace');
      
      // Vérifier que nous sommes côté client
      if (typeof window !== 'undefined') {
        // Récupérer l'ID du workspace sauvegardé
        const savedWorkspaceId = localStorage.getItem('selectedWorkspaceId');
        console.log('🔍 Workspace sauvegardé:', savedWorkspaceId);
        
        if (savedWorkspaceId) {
          // Chercher le workspace sauvegardé
          const savedWorkspace = workspaces.find(ws => ws.id === savedWorkspaceId);
          console.log('🔍 Workspace trouvé:', savedWorkspace);
          if (savedWorkspace) {
            console.log('✅ Restauration du workspace sauvegardé');
            setSelectedWorkspace(savedWorkspace);
            setIsInitialized(true);
            return;
          }
        }
      }
      
      // Si aucun workspace sauvegardé trouvé, sélectionner le premier
      console.log('🔍 Sélection du premier workspace:', workspaces[0]);
      setSelectedWorkspace(workspaces[0]);
      setIsInitialized(true);
    }
  }, [workspaces, selectedWorkspace, isInitialized, setSelectedWorkspace]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Propriétaire';
      case 'admin': return 'Administrateur';
      case 'editor': return 'Éditeur';
      case 'viewer': return 'Observateur';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Chargement des workspaces...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <FileText className="h-16 w-16 mx-auto mb-2" />
                <h3 className="text-xl font-semibold">Erreur de chargement</h3>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workspaces</h1>
          <p className="text-gray-600">
            Gérez vos équipes et collaborez sur vos contenus
          </p>
        </div>

        {/* Workspace Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <WorkspaceSelector
                selectedWorkspace={selectedWorkspace}
                onWorkspaceChange={setSelectedWorkspace}
                onCreateWorkspace={() => setShowCreateDialog(true)}
                workspaces={workspaces}
                loading={loading}
              />
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau workspace
            </Button>
          </div>
        </div>

        {selectedWorkspace ? (
          <div className="space-y-6">
            {/* Workspace Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedWorkspace.name}
                  </h2>
                  {selectedWorkspace.description && (
                    <p className="text-gray-600 mb-4">{selectedWorkspace.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(selectedWorkspace.memberRole)}>
                      {getRoleLabel(selectedWorkspace.memberRole)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Vous êtes {getRoleLabel(selectedWorkspace.memberRole).toLowerCase()} de ce workspace
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membres</p>
                    <p className="text-lg font-semibold">-</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Posts</p>
                    <p className="text-lg font-semibold">-</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Planifiés</p>
                    <p className="text-lg font-semibold">-</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vues</p>
                    <p className="text-lg font-semibold">-</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Registration Notice */}
            <RegistrationNotice />

            {/* Team Management */}
            <TeamManagement
              workspaceId={selectedWorkspace.id}
              currentUserRole={selectedWorkspace.memberRole}
            />
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun workspace sélectionné
            </h3>
            <p className="text-gray-600 mb-6">
              Sélectionnez un workspace existant ou créez-en un nouveau pour commencer à collaborer
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer votre premier workspace
            </Button>
          </Card>
        )}

        {/* Create Workspace Dialog */}
        <CreateWorkspaceDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      </div>
    </div>
  );
}
