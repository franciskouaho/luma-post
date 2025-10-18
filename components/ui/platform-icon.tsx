import React from 'react';
import Image from 'next/image';

interface PlatformIconProps {
  platform: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  profileImageUrl?: string;
  username?: string;
}

export function PlatformIcon({ platform, size = 'md', className = '', profileImageUrl, username }: PlatformIconProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  // Si className contient une taille spécifique (comme w-1.5 h-1.5), l'utiliser
  const hasCustomSize = className.includes('w-') && className.includes('h-');
  const finalSizeClass = hasCustomSize ? className : sizeClasses[size];
  
  // Extraire les classes de style (ring, border, etc.) de className
  const styleClasses = className.split(' ').filter(cls => 
    cls.includes('ring-') || cls.includes('border-') || cls.includes('shadow-') || 
    cls.includes('scale-') || cls.includes('transition-') || cls.includes('opacity-')
  ).join(' ');



  const getPlatformIcon = () => {
    const getProfileImage = () => {
      if (profileImageUrl) {
        return (
          <Image
            src={profileImageUrl}
            alt={username || 'Profile'}
            fill
            className="rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      }
      return (
        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
          {username ? (
            <span className="text-xs font-semibold text-gray-700">
              {username.charAt(0).toUpperCase()}
            </span>
          ) : (
            <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          )}
        </div>
      );
    };

    switch (platform.toLowerCase()) {
      case 'tiktok':
        return (
          <div className={`${finalSizeClass} relative aspect-square rounded-full ${styleClasses}`}>
            {/* Cercle de fond vert */}
            <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center overflow-hidden relative">
              {getProfileImage()}
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center hidden">
                <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            {/* Logo TikTok dans le coin */}
            <div className={`absolute -top-1 -left-1 ${hasCustomSize ? 'w-3 h-3' : 'w-5 h-5'} bg-black rounded-full flex items-center justify-center`}>
              <svg className={hasCustomSize ? 'w-2 h-2' : 'w-3 h-3'} viewBox="0 0 24 24" fill="none">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#FF0050"/>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#00F2EA"/>
              </svg>
            </div>
          </div>
        );
      
      case 'instagram':
        return (
          <div className={`${finalSizeClass} relative aspect-square rounded-full ${styleClasses}`}>
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {getProfileImage()}
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center hidden">
                <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <div className={`absolute -top-1 -left-1 ${hasCustomSize ? 'w-3 h-3' : 'w-5 h-5'} bg-white rounded-full flex items-center justify-center border border-gray-200`}>
              <svg className={hasCustomSize ? 'w-2 h-2' : 'w-3 h-3'} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-5.466 1.33-5.666 5.667-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 1.33 5.466 5.667 5.667 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 5.466-1.33 5.667-5.667.059-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-1.33-5.466-5.667-5.667-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </div>
        );

      case 'facebook':
        return (
          <div className={`${finalSizeClass} relative aspect-square rounded-full ${styleClasses}`}>
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {getProfileImage()}
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center hidden">
                <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <div className={`absolute -top-1 -left-1 ${hasCustomSize ? 'w-3 h-3' : 'w-4 h-4'} bg-white rounded-full flex items-center justify-center border border-gray-200`}>
              <svg className={hasCustomSize ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-blue-600 fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className={`${finalSizeClass} relative aspect-square rounded-full ${styleClasses}`}>
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {getProfileImage()}
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center hidden">
                <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <div className={`absolute -top-1 -left-1 ${hasCustomSize ? 'w-3 h-3' : 'w-4 h-4'} bg-white rounded-full flex items-center justify-center border border-gray-200`}>
              <svg className={hasCustomSize ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-blue-700 fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
          </div>
        );

      case 'youtube':
        return (
          <div className={`${finalSizeClass} relative aspect-square rounded-full ${styleClasses}`}>
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {getProfileImage()}
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center hidden">
                <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <div className={`absolute -top-1 -left-1 ${hasCustomSize ? 'w-3 h-3' : 'w-4 h-4'} bg-white rounded-full flex items-center justify-center border border-gray-200`}>
              <svg className={hasCustomSize ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-red-600 fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          </div>
        );

      case 'twitter':
        return (
          <div className={`${finalSizeClass} relative aspect-square rounded-full ${styleClasses}`}>
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {getProfileImage()}
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center hidden">
                <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <div className={`absolute -top-1 -left-1 ${hasCustomSize ? 'w-3 h-3' : 'w-4 h-4'} bg-white rounded-full flex items-center justify-center border border-gray-200`}>
              <svg className={hasCustomSize ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-blue-400 fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </div>
          </div>
        );

      default:
        return (
          <div className={`${finalSizeClass} relative ${styleClasses}`}>
            <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-2/3 h-2/3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
        );
    }
  };

  return getPlatformIcon();
}
