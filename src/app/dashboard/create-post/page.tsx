'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PermissionGuard, WorkspaceRequired } from '@/components/workspace/permission-guard';
import { 
  Type, 
  Image, 
  Video, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Mountain,
  Camera
} from 'lucide-react';

export default function DashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const postTypes = [
    {
      id: 'text',
      title: 'Text Post',
      icon: Type,
      description: 'Create text-based posts',
      platforms: [
        { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
        { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
        { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
      ]
    },
    {
      id: 'image',
      title: 'Image Post',
      icon: Mountain,
      description: 'Create posts with images',
      platforms: [
        { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
        { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
        { name: 'Pinterest', icon: Image, color: 'text-red-600' },
        { name: 'TikTok', icon: Video, color: 'text-black' },
        { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
      ]
    },
    {
      id: 'video',
      title: 'Video Post',
      icon: Camera,
      description: 'Create posts with videos',
      platforms: [
        { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
        { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
        { name: 'Pinterest', icon: Image, color: 'text-red-600' },
        { name: 'TikTok', icon: Video, color: 'text-black' },
        { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
      ]
    }
  ];

  return (
    <WorkspaceRequired>
      <PermissionGuard permission="canCreatePosts">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {postTypes.map((postType) => {
            const Icon = postType.icon;
            return (
              <Link
                key={postType.id}
                href={postType.id === 'video' ? '/dashboard/upload' : `/dashboard/create/${postType.id}`}
                className="group"
                onMouseEnter={() => setHoveredCard(postType.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`
                  relative p-8 border-2 border-dashed rounded-xl transition-all duration-200 hover:shadow-lg
                  ${hoveredCard === postType.id 
                    ? 'shadow-lg scale-105' 
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                  }
                `}
                style={hoveredCard === postType.id ? {
                  borderColor: 'var(--luma-purple-light)',
                  background: 'var(--luma-purple-light)',
                  opacity: '0.1'
                } : {}}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`
                      p-4 rounded-full transition-colors
                      ${hoveredCard === postType.id 
                        ? '' 
                        : 'bg-gray-100'
                      }
                    `}
                    style={hoveredCard === postType.id ? {
                      background: 'var(--luma-purple-light)'
                    } : {}}
                    >
                      <Icon className={`
                        h-8 w-8 transition-colors
                        ${hoveredCard === postType.id 
                          ? '' 
                          : 'text-gray-600'
                        }
                      `}
                      style={hoveredCard === postType.id ? {
                        color: 'var(--luma-purple)'
                      } : {}} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    {postType.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-6">
                    {postType.description}
                  </p>

                  {/* Platforms */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {postType.platforms.map((platform) => {
                      const PlatformIcon = platform.icon;
                      return (
                        <div
                          key={platform.name}
                          className="flex items-center px-2 py-1 bg-white rounded-md border border-gray-200"
                        >
                          <PlatformIcon className={`h-4 w-4 mr-1 ${platform.color}`} />
                          <span className="text-xs text-gray-700">{platform.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Link>
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
      </PermissionGuard>
    </WorkspaceRequired>
  );
}