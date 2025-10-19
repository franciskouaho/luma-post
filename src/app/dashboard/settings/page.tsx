'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Plus,
  Settings as SettingsIcon,
  Info,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  Key,
  Lock,
  RefreshCw,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profile: {
      name: 'Francis KOUAHO',
      email: 'kouahofrancis@gmail.com',
      timezone: 'Europe/Paris',
      language: 'fr'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      publishSuccess: true,
      publishFailure: true,
      weeklyReport: true,
      newFollower: false
    },
    privacy: {
      dataRetention: '12',
      analyticsSharing: false,
      profileVisibility: 'private'
    },
    integrations: {
      autoSync: true,
      backupEnabled: true,
      apiAccess: false
    }
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('sk_live_1234567890abcdef');

  const handleSave = () => {
    // Ici on ferait l'appel API pour sauvegarder
  };

  const handleExportData = () => {
    // Ici on ferait l'export des données
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header moderne avec statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg lis:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Paramètres
                </h1>
                <SettingsIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">Gérez vos préférences et paramètres de compte</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleSave}
                className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{ background: 'var(--luma-gradient-primary)' }}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Profil</p>
                    <p className="text-2xl font-bold text-slate-900">Actif</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Notifications</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {Object.values(settings.notifications).filter(Boolean).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Sécurité</p>
                    <p className="text-2xl font-bold text-green-900">Haut</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Intégrations</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {Object.values(settings.integrations).filter(Boolean).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                Profil
              </CardTitle>
              <CardDescription className="text-gray-600">
                Informations personnelles et préférences de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 shadow-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    L'email ne peut pas être modifié
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Fuseau horaire
                  </label>
                  <select
                    value={settings.profile.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, timezone: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm transition-all duration-200"
                  >
                    <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Langue
                  </label>
                  <select
                    value={settings.profile.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, language: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm transition-all duration-200"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </CardContent>
        </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Notifications par email</h4>
                    <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notifications push</h4>
                  <p className="text-sm text-gray-500">Recevoir des notifications push dans le navigateur</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="ml-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Publication réussie</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.publishSuccess}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, publishSuccess: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Échec de publication</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.publishFailure}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, publishFailure: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Rapport hebdomadaire</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReport}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, weeklyReport: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Confidentialité et sécurité
            </CardTitle>
            <CardDescription>
              Gérez vos données et paramètres de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rétention des données (mois)
                </label>
                <select
                  value={settings.privacy.dataRetention}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, dataRetention: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="6">6 mois</option>
                  <option value="12">12 mois</option>
                  <option value="24">24 mois</option>
                  <option value="0">Indéfiniment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilité du profil
                </label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, profileVisibility: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="private">Privé</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Partage des données analytiques</h4>
                <p className="text-sm text-gray-500">Autoriser le partage anonyme des données pour améliorer le service</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.analyticsSharing}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, analyticsSharing: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* API & Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              API et intégrations
            </CardTitle>
            <CardDescription>
              Gérez vos clés API et intégrations tierces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Synchronisation automatique</h4>
                  <p className="text-sm text-gray-500">Synchroniser automatiquement les données avec TikTok</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.integrations.autoSync}
                    onChange={(e) => setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, autoSync: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Sauvegarde automatique</h4>
                  <p className="text-sm text-gray-500">Sauvegarder automatiquement vos données</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.integrations.backupEnabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, backupEnabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Clé API</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Utilisez cette clé pour accéder à l'API TikTok Crossposter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Gestion des données
            </CardTitle>
            <CardDescription>
              Exportez ou supprimez vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">Exporter mes données</h4>
                <p className="text-sm text-blue-700">
                  Téléchargez une copie de toutes vos données
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900">Supprimer mon compte</h4>
                <p className="text-sm text-red-700">
                  Cette action est irréversible et supprimera toutes vos données
                </p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* Actions en bas */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-white">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <Save className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sauvegarder les modifications</h3>
                    <p className="text-sm text-gray-600">Appliquez vos changements de paramètres</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    style={{ background: 'var(--luma-gradient-primary)' }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
