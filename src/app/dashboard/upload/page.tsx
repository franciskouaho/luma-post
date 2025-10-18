'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Calendar, 
  Clock, 
  Play, 
  Settings,
  X,
  ChevronDown,
  Info,
  FileText,
  History,
  Cog,
  Wand2
} from 'lucide-react';
import Image from 'next/image';
import TikTokLogo from '@/assets/logo/tiktok.png';

interface TikTokAccount {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isActive: boolean;
  platform: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  username?: string;
  avatar?: string;
  displayName?: string;
  accountId?: string;
}

export default function CreateVideoPostPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('Oct 23, 2025');
  const [scheduleTime, setScheduleTime] = useState('2:15 PM');
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les comptes connectés depuis Firebase
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/accounts');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts || []);
          
          // Créer les plateformes basées sur les vrais comptes
          const platformMap: { [key: string]: Platform } = {};
          
          // Ajouter TikTok avec les vrais comptes
          data.accounts.forEach((account: TikTokAccount) => {
            if (account.platform === 'tiktok') {
              platformMap[account.id] = {
                id: account.id,
                name: 'TikTok',
                icon: '♪',
                color: 'bg-black',
                connected: true,
                username: account.displayName || account.username,
                avatar: account.avatarUrl,
                displayName: account.displayName,
                accountId: account.id
              };
            }
          });
          
          // Seules les vraies plateformes connectées sont affichées
          
          setPlatforms(Object.values(platformMap));
          
          // Sélectionner automatiquement le premier compte TikTok connecté
          const firstTikTokAccount = data.accounts.find((account: TikTokAccount) => account.platform === 'tiktok');
          if (firstTikTokAccount) {
            setSelectedPlatforms([firstTikTokAccount.id]);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des comptes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handlePlatformSelect = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform?.connected) return;

    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleSchedule = async () => {
    if (!videoFile || selectedPlatforms.length === 0) {
      alert('Veuillez sélectionner une vidéo et au moins une plateforme');
      return;
    }

    try {
      // Créer le post dans Firebase
      const postData = {
        userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
        caption,
        videoFile: videoFile.name,
        platforms: selectedPlatforms,
        scheduledAt: scheduleEnabled ? new Date(`${scheduleDate} ${scheduleTime}`) : new Date(),
        status: scheduleEnabled ? 'scheduled' : 'pending',
        createdAt: new Date()
      };

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('Post programmé avec succès !');
        // Reset form
        setVideoFile(null);
        setCaption('');
        setSelectedPlatforms([]);
      } else {
        alert('Erreur lors de la programmation du post');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la programmation du post');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  Create video post
                </h1>
                <p className="text-gray-600 text-lg">
                  Créez et planifiez vos vidéos pour vos réseaux sociaux
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search & Filter"
                    className="w-72 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                  />
                  <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des comptes connectés...</p>
              </div>
            ) : (
              <div className="space-y-4">
                 <div className={`grid gap-3 ${platforms.length <= 5 ? 'grid-cols-5' : platforms.length <= 10 ? 'grid-cols-10' : 'grid-cols-12'}`}>
                   {platforms.map((platform) => (
                     <div
                       key={platform.id}
                       className={`relative group cursor-pointer transition-all duration-200 ${
                         platform.connected ? 'hover:scale-105' : 'cursor-not-allowed'
                       }`}
                       onClick={() => handlePlatformSelect(platform.id)}
                       title={platform.connected ? `${platform.name} - ${platform.username}` : `${platform.name} - Non connecté`}
                     >
                       <div
                         className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${
                           platform.connected 
                             ? selectedPlatforms.includes(platform.id)
                               ? 'ring-4 ring-green-500 shadow-lg'
                               : 'shadow-md hover:shadow-lg'
                             : 'opacity-50'
                         }`}
                       >
                         {platform.connected && platform.avatar && platform.avatar.startsWith('http') ? (
                           // Vraie photo de profil
                           <div className="w-full h-full">
                             <Image 
                               src={platform.avatar} 
                               alt={platform.username}
                               width={48}
                               height={48}
                               className="w-full h-full object-cover"
                               unoptimized
                             />
                           </div>
                         ) : platform.connected ? (
                           // Avatar avec initiales si pas de photo
                           <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                             <span className="text-white text-sm font-medium">
                               {platform.displayName?.charAt(0) || platform.username?.charAt(0) || 'T'}
                             </span>
                           </div>
                         ) : (
                           // Plateforme non connectée
                           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                             {platform.name === 'TikTok' ? (
                               <Image 
                                 src={TikTokLogo} 
                                 alt="TikTok"
                                 width={24}
                                 height={24}
                                 className="w-6 h-6 opacity-50"
                               />
                             ) : (
                               <span className="text-gray-500 text-lg">{platform.icon}</span>
                             )}
                           </div>
                         )}
                       </div>
                       
                       {/* Logo TikTok au-dessus */}
                       {platform.connected && platform.name === 'TikTok' && (
                         <div className="absolute -top-2 -left-2 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-lg">
                           <Image 
                             src={TikTokLogo} 
                             alt="TikTok"
                             width={16}
                             height={16}
                             className="w-4 h-4"
                           />
                         </div>
                       )}
                       
                       {/* Tooltip avec nom d'utilisateur */}
                       <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                         {platform.connected ? `${platform.username}` : `${platform.name} - Non connecté`}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* Video Upload Area */}
          <div className="mb-8">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {videoFile ? (
                <div className="space-y-4">
                  <div className="w-32 h-20 bg-black rounded-lg mx-auto flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">{videoFile.name}</p>
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" size="sm">
                        Replace Media
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCoverModal(true);
                        }}
                      >
                        Set Cover
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
                    <Upload className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      Click to upload or drag and drop or hover and paste from clipboard
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <span>Video</span>
                      <Info className="h-4 w-4" />
                      <Button variant="outline" size="sm">
                        Import
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-lg font-semibold">Main Caption</h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Start writing your post here..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <div className="flex justify-end mt-2">
              <span className="text-sm text-gray-500">{caption.length}/2200</span>
            </div>
          </div>

          {/* Post Configurations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Post configurations & tools</h3>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Platform Captions</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Past Captions</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4" />
                <span>Processing</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>TikTok Config</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Schedule Post */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="space-y-6">
          {/* Schedule Post */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule post</h3>
              <button
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  scheduleEnabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    scheduleEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {scheduleEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{scheduleDate}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{scheduleTime}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Your post will be posted at {scheduleTime} in your local time.
                </p>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSchedule}
                    disabled={!videoFile || selectedPlatforms.length === 0}
                  >
                    {scheduleEnabled ? 'Schedule' : 'Publish Now'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save to Drafts
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Media Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Media Preview</h3>
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">people with this diet... aren't on a diet</p>
              </div>
            </div>
            {videoFile && (
              <p className="text-sm text-gray-500 mt-2">{videoFile.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cover Frame Selection Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-4/5 max-w-4xl max-h-4/5 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-semibold">Select Cover Frame</h2>
              </div>
              <button
                onClick={() => setShowCoverModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* New Cover Image */}
              <div>
                <h3 className="text-lg font-semibold mb-4">New cover image</h3>
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-white text-center">
                    <Play className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">people with this diet... aren't on a diet</p>
                  </div>
                </div>
              </div>

              {/* Current Cover */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current cover</h3>
                <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-gray-500">No cover selected</p>
                </div>
              </div>
            </div>

            {/* Timeline Scrubber */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Use this bar to select your cover frame</p>
              <div className="relative">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div className="absolute top-0 left-1/3 w-1 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowCoverModal(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Set as Cover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}