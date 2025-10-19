'use client';

import React, { useState } from 'react';
import { useWorkspaces, Workspace } from '@/hooks/use-workspaces';
import { useWorkspaceStats } from '@/hooks/use-workspace-stats';
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
  Loader2,
  Info,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

export default function WorkspacesPage() {
  const { workspaces, loading, error } = useWorkspaces();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceContext();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Récupérer les statistiques du workspace sélectionné
  const { stats, loading: statsLoading } = useWorkspaceStats(selectedWorkspace?.id || null);


  // Initialiser la sélection du workspace quand les workspaces sont chargés
  React.useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace && !isInitialized) {
      // Vérifier que nous sommes côté client
      if (typeof window !== 'undefined') {
        // Récupérer l'ID du workspace sauvegardé
        const savedWorkspaceId = localStorage.getItem('selectedWorkspaceId');
        
        if (savedWorkspaceId) {
          // Chercher le workspace sauvegardé
          const savedWorkspace = workspaces.find(ws => ws.id === savedWorkspaceId);
          if (savedWorkspace) {
            setSelectedWorkspace(savedWorkspace);
            setIsInitialized(true);
            return;
          }
        }
      }
      
      // Si aucun workspace sauvegardé trouvé, sélectionner le premier
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header modernisé */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-emerald-600 bg-clip-text text-transparent">
              Workspaces
            </h1>
            <Info className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">
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
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-emerald-50 to-white">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedWorkspace.name}
                      </h2>
                      {selectedWorkspace.description && (
                        <p className="text-gray-600 mb-4">{selectedWorkspace.description}</p>
                      )}
                      <div className="flex items-center gap-3">
                        <Badge className={`${getRoleColor(selectedWorkspace.memberRole)} border-0 shadow-sm`}>
                          {getRoleLabel(selectedWorkspace.memberRole)}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Shield className="h-4 w-4 mr-1" />
                          Vous êtes {getRoleLabel(selectedWorkspace.memberRole).toLowerCase()} de ce workspace
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 shadow-sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats modernisées */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Membres</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.members}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Posts</p>
                      <p className="text-2xl font-bold text-green-900">
                        {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.posts}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Planifiés</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.scheduled}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Vues</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.views}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun workspace sélectionné
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Sélectionnez un workspace existant ou créez-en un nouveau pour commencer à collaborer
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{ background: 'var(--luma-gradient-primary)' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer votre premier workspace
              </Button>
            </div>
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
