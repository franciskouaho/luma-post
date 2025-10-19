'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Type, 
  Image, 
  Video, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Mountain,
  Lock
} from 'lucide-react';
import { useConnectedAccounts } from '@/hooks/use-connected-accounts';

// Icône TikTok personnalisée
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function DashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { isPlatformConnected } = useConnectedAccounts();

  // Fonction pour vérifier si un type de post est disponible
  const isPostTypeAvailable = (platforms: string[]) => {
    return platforms.some(platform => isPlatformConnected(platform));
  };

  const postTypes = [
    {
      id: 'text',
      name: 'Text Post',
      description: 'Create a simple text-based post for your social media accounts',
      icon: Type,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      platforms: ['twitter', 'linkedin', 'instagram'],
      platformIcons: [
        { name: 'Twitter', icon: Twitter, color: 'text-blue-500' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
        { name: 'Instagram', icon: Instagram, color: 'text-pink-500' }
      ]
    },
    {
      id: 'image',
      name: 'Image Post',
      description: 'Upload and share images with captions across your platforms',
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      platforms: ['instagram', 'twitter', 'linkedin'],
      platformIcons: [
        { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
        { name: 'Twitter', icon: Twitter, color: 'text-blue-500' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' }
      ]
    },
    {
      id: 'video',
      name: 'Video Post',
      description: 'Upload and share videos with captions and hashtags',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      platforms: ['youtube', 'instagram', 'tiktok'],
      platformIcons: [
        { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
        { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
        { name: 'TikTok', icon: TikTokIcon, color: 'text-black' }
      ]
    },
    {
      id: 'carousel',
      name: 'Carousel Post',
      description: 'Create multi-image posts for Instagram and LinkedIn',
      icon: Mountain,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      platforms: ['instagram', 'linkedin'],
      platformIcons: [
        { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' }
      ]
    }
  ].map(postType => ({
    ...postType,
    isAvailable: isPostTypeAvailable(postType.platforms)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Create a new post
          </h1>
          <p className="text-gray-600">
            Choose the type of content you want to create and publish across your social media accounts.
          </p>
        </div>

        {/* Post Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {postTypes.map((postType) => {
            const Icon = postType.icon;
            const isAvailable = postType.isAvailable;
            
            return (
              <div
                key={postType.id}
                className={`relative ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseEnter={() => isAvailable && setHoveredCard(postType.id)}
                onMouseLeave={() => isAvailable && setHoveredCard(null)}
              >
                {isAvailable ? (
                  <Link
                    href={`/dashboard/create-post/${postType.id}`}
                    className="block"
                  >
                    <div
                      className={`p-6 rounded-xl border-2 border-transparent transition-all duration-300 cursor-pointer transform hover:scale-105 ${postType.bgColor} ${postType.hoverColor} ${
                        hoveredCard === postType.id ? 'shadow-lg border-gray-300' : 'shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg bg-white ${postType.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">
                          {postType.name}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {postType.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Supported platforms:</span>
                        <div className="flex space-x-1">
                          {postType.platformIcons.map((platform) => {
                            const PlatformIcon = platform.icon;
                            return (
                              <div
                                key={platform.name}
                                className="p-1 rounded bg-white"
                                title={platform.name}
                              >
                                <PlatformIcon className={`h-4 w-4 ${platform.color}`} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`p-6 rounded-xl border-2 border-transparent transition-all duration-300 ${postType.bgColor} shadow-md`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg bg-white ${postType.color} opacity-50`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-lg font-semibold text-gray-500 flex items-center">
                          {postType.name}
                          <Lock className="h-4 w-4 ml-2" />
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">
                      {postType.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Supported platforms:</span>
                      <div className="flex space-x-1">
                        {postType.platformIcons.map((platform) => {
                          const PlatformIcon = platform.icon;
                          return (
                            <div
                              key={platform.name}
                              className="p-1 rounded bg-white opacity-50"
                              title={platform.name}
                            >
                              <PlatformIcon className={`h-4 w-4 ${platform.color}`} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connect More Accounts */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--luma-purple)' }}>
            You can{' '}
            <Link href="/dashboard/accounts" className="underline" style={{ color: 'var(--luma-purple-dark)' }}>
              connect more accounts here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}