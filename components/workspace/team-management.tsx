'use client';

import { useState } from 'react';
import { useWorkspaceMembers, WorkspaceMember } from '@/hooks/use-workspaces';
import { UserSearch } from './user-search';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Crown, 
  Shield, 
  Edit, 
  Eye,
  Trash2,
  Loader2,
  Search
} from 'lucide-react';

interface TeamManagementProps {
  workspaceId: string;
  currentUserRole: 'owner' | 'admin' | 'editor' | 'viewer';
}

export function TeamManagement({ workspaceId, currentUserRole }: TeamManagementProps) {
  const { members, loading, inviteMember, updateMember, removeMember } = useWorkspaceMembers(workspaceId);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const canManageMembers = ['owner', 'admin'].includes(currentUserRole);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'editor': return <Edit className="h-4 w-4 text-green-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'suspended': return 'Suspendu';
      default: return status;
    }
  };

  const handleUserSelect = async (user: { uid: string; email: string; displayName: string; photoURL?: string }) => {
    try {
      setIsInviting(true);
      await inviteMember(user.email, inviteRole);
      setInviteRole('editor');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateMember = async (memberId: string, updates: { role?: string; status?: string }) => {
    try {
      setIsUpdating(true);
      await updateMember(memberId, updates);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;

    try {
      setIsUpdating(true);
      await removeMember(memberId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Chargement des membres...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
        {/* Invitation de nouveaux membres */}
        {canManageMembers && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Ajouter des membres</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Rôle par défaut</Label>
                <select
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="editor">Éditeur</option>
                  <option value="admin">Administrateur</option>
                  <option value="viewer">Observateur</option>
                </select>
              </div>

              <Button
                onClick={() => setShowUserSearch(true)}
                disabled={isInviting}
                className="w-full"
              >
                {isInviting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher un utilisateur
                  </>
                )}
              </Button>

              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Note importante :</h4>
                <p className="text-xs text-blue-800">
                  L&apos;utilisateur doit être déjà inscrit dans l&apos;application pour pouvoir être ajouté au workspace.
                </p>
              </div>
            </div>
          </Card>
        )}

      {/* Liste des membres */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Membres de l'équipe</h3>
          <Badge variant="outline">{members.length}</Badge>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun membre dans ce workspace</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {member.photoURL ? (
                      <img src={member.photoURL} alt={member.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-gray-200 flex items-center justify-center h-full w-full">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.displayName}</span>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getRoleColor(member.role)}>
                    {getRoleLabel(member.role)}
                  </Badge>
                  <Badge className={getStatusColor(member.status)}>
                    {getStatusLabel(member.status)}
                  </Badge>

                  {canManageMembers && member.role !== 'owner' && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                        disabled={isUpdating}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Menu d'actions pour un membre */}
      <Dialog open={!!selectedMember && canManageMembers} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>Gérer {selectedMember?.displayName}</DialogTitle>
            <DialogDescription>
              Modifiez le rôle et le statut de ce membre du workspace.
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select
                  value={selectedMember.role}
                  onValueChange={(value) => handleUpdateMember(selectedMember.id, { role: value })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="editor">Éditeur</SelectItem>
                    <SelectItem value="viewer">Observateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={selectedMember.status}
                  onValueChange={(value) => handleUpdateMember(selectedMember.id, { status: value })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedMember(null)}
              disabled={isUpdating}
            >
              Fermer
            </Button>
            {selectedMember && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleRemoveMember(selectedMember.id);
                  setSelectedMember(null);
                }}
                disabled={isUpdating}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Search Dialog */}
      <UserSearch
        isOpen={showUserSearch}
        onUserSelect={handleUserSelect}
        onClose={() => setShowUserSearch(false)}
      />
    </div>
  );
}
