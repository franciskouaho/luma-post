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
  Camera
} from 'lucide-react';

export default function DashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const postTypes = [
    {
      id: 'text',
      name: 'Text Post',
      description: 'Create a simple text-based post for your social media accounts',
      icon: Type,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      platforms: [
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
      platforms: [
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
      platforms: [
        { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
        { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
        { name: 'TikTok', icon: Camera, color: 'text-black' }
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
      platforms: [
        { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' }
      ]
    }
  ];

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
            return (
              <Link
                key={postType.id}
                href={`/dashboard/create-post/${postType.id}`}
                className="block"
                onMouseEnter={() => setHoveredCard(postType.id)}
                onMouseLeave={() => setHoveredCard(null)}
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
                      {postType.platforms.map((platform) => {
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