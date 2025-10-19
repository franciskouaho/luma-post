'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Plus, 
  Calendar, 
  Grid3X3, 
  Clock, 
  Send, 
  FileEdit,
  Link2, 
  Settings, 
  HelpCircle,
  ChevronDown,
  User,
  BarChart3,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarProps) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Import dynamique pour éviter les erreurs côté serveur
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebaseClient');
      
      await signOut(auth);
      // Rediriger vers la page de connexion
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const navigation = [
    {
      name: 'Overview',
      items: [
        { name: 'Overview', href: '/dashboard', icon: BarChart3 },
      ]
    },
    {
      name: 'Posts',
      items: [
        { name: 'All', href: '/dashboard/all-posts', icon: Grid3X3 },
        { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
        { name: 'Scheduled', href: '/dashboard/schedule', icon: Clock },
        { name: 'Posted', href: '/dashboard/all-posts', icon: Send },
        { name: 'Drafts', href: '/dashboard/drafts', icon: FileEdit },
      ]
    },
    {
      name: 'Configuration',
      items: [
        { name: 'Connections', href: '/dashboard/accounts', icon: Link2 },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    },
    {
      name: 'Support',
      items: [
        { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="Luma Post" 
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Luma Post</h1>
          </div>
        </div>

        {/* Workspace */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center">
              <Home className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium text-gray-900">main</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Create Post Button */}
        <div className="p-4">
          <Link href="/dashboard/create-post">
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
              Create post
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-6">
          {navigation.map((section) => (
            <div key={section.name}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.name}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pathname === item.href
                            ? 'bg-green-50 text-green-700 border-l-4 border-green-500 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Francis</p>
                <p className="text-xs text-gray-500">Pro Plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
