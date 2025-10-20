"use client";

import React, { useState } from "react";
import { useWorkspaces, Workspace } from "@/hooks/use-workspaces";
import { useWorkspaceStats } from "@/hooks/use-workspace-stats";
import { WorkspaceSelector } from "@/components/workspace/workspace-selector";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { TeamManagement } from "@/components/workspace/team-management";
import { RegistrationNotice } from "@/components/workspace/registration-notice";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  Crown,
} from "lucide-react";

export default function WorkspacesPage() {
  const { workspaces, loading, error } = useWorkspaces();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceContext();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { stats, loading: statsLoading } = useWorkspaceStats(
    selectedWorkspace?.id || null,
  );

  React.useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace && !isInitialized) {
      if (typeof window !== "undefined") {
        const savedWorkspaceId = localStorage.getItem("selectedWorkspaceId");

        if (savedWorkspaceId) {
          const savedWorkspace = workspaces.find(
            (ws) => ws.id === savedWorkspaceId,
          );
          if (savedWorkspace) {
            setSelectedWorkspace(savedWorkspace);
            setIsInitialized(true);
            return;
          }
        }
      }

      setSelectedWorkspace(workspaces[0]);
      setIsInitialized(true);
    }
  }, [workspaces, selectedWorkspace, isInitialized, setSelectedWorkspace]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "from-purple-500 to-purple-600";
      case "admin":
        return "from-blue-500 to-blue-600";
      case "editor":
        return "from-green-500 to-green-600";
      case "viewer":
        return "from-slate-400 to-slate-500";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-700";
      case "admin":
        return "bg-blue-100 text-blue-700";
      case "editor":
        return "bg-green-100 text-green-700";
      case "viewer":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Owner";
      case "admin":
        return "Admin";
      case "editor":
        return "Editor";
      case "viewer":
        return "Viewer";
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "editor":
        return <FileText className="w-4 h-4" />;
      case "viewer":
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-100 rounded-full mx-auto animate-ping"></div>
          </div>
          <p className="text-slate-700 font-medium">Loading workspaces...</p>
          <p className="text-slate-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Loading Error
          </h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      {/* Modern Sticky Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Workspaces
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your teams and collaborate on content
              </p>
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              New Workspace
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Workspace Selector */}
        <div className="mb-6">
          <WorkspaceSelector
            selectedWorkspace={selectedWorkspace}
            onWorkspaceChange={setSelectedWorkspace}
            onCreateWorkspace={() => setShowCreateDialog(true)}
            workspaces={workspaces}
            loading={loading}
          />
        </div>

        {selectedWorkspace ? (
          <div className="space-y-6">
            {/* Workspace Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${getRoleColor(selectedWorkspace.memberRole)} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {selectedWorkspace.name}
                    </h2>
                    {selectedWorkspace.description && (
                      <p className="text-slate-600 mb-4 max-w-2xl">
                        {selectedWorkspace.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 ${getRoleBadgeColor(selectedWorkspace.memberRole)} rounded-full text-xs font-semibold`}
                      >
                        {getRoleIcon(selectedWorkspace.memberRole)}
                        {getRoleLabel(selectedWorkspace.memberRole)}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1.5">
                        <Shield className="w-4 h-4" />
                        You are{" "}
                        {getRoleLabel(
                          selectedWorkspace.memberRole,
                        ).toLowerCase()}{" "}
                        of this workspace
                      </span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      Members
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {statsLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      ) : (
                        stats.members
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                      Posts
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {statsLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                      ) : (
                        stats.posts
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                      Scheduled
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {statsLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                      ) : (
                        stats.scheduled
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                      Views
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {statsLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                      ) : (
                        stats.views
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-sm border border-slate-200/60 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No Workspace Selected
            </h3>
            <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
              Select an existing workspace or create a new one to start
              collaborating
            </p>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Your First Workspace
            </button>
          </div>
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
