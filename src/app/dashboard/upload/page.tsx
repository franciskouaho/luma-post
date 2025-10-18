'use client';

import { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Calendar, 
  Clock, 
  Play, 
  Settings,
  X,
  ChevronDown,
  Info,
  History,
  Wand2
} from 'lucide-react';
import { PlatformIcon } from '@/components/ui/platform-icon';

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

function CreateVideoPostPageContent() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedCoverFrame, setSelectedCoverFrame] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [coverFrames, setCoverFrames] = useState<string[]>([]);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingDraftData, setEditingDraftData] = useState<{id: string, videoUrl: string, caption: string, thumbnailUrl?: string} | null>(null);
  const [editingScheduleData, setEditingScheduleData] = useState<{id: string, videoUrl: string, caption: string, thumbnailUrl?: string, scheduledAt: string} | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isGeneratingFrames, setIsGeneratingFrames] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  // Initialiser les dates par défaut
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(tomorrow.getHours() + 1, 0, 0, 0);
    
    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTime(tomorrow.toTimeString().slice(0, 5));
  }, []);

  // Mémoriser l'URL de la vidéo
  const videoUrl = useMemo(() => {
    if (!videoFile) return null;
    
    // Priorité 1: URL uploadée (pour édition de schedule)
    if (uploadedVideoUrl) {
      return uploadedVideoUrl;
    }
    
    // Priorité 2: URL du draft en édition
    if (editingDraftData?.videoUrl) {
      return editingDraftData.videoUrl;
    }
    
    // Priorité 3: URL du schedule en édition
    if (editingScheduleData?.videoUrl) {
      return editingScheduleData.videoUrl;
    }
    
    // Sinon, créer une URL locale
    return URL.createObjectURL(videoFile);
  }, [videoFile, uploadedVideoUrl, editingDraftData, editingScheduleData]);

  // Nettoyer les URLs d'objet lors du démontage
  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Charger les comptes connectés
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/accounts');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts || []);
          
          const platformMap: { [key: string]: Platform } = {};
          
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
          
          setPlatforms(Object.values(platformMap));
          
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

  // Charger les données du draft à éditer
  useEffect(() => {
    const isEditMode = searchParams?.get('edit') === 'true';
    const editType = searchParams?.get('type');
    
    if (isEditMode && editType === 'draft') {
      try {
        const draftData = localStorage.getItem('editingDraft');
        if (draftData) {
          const draft = JSON.parse(draftData);
          
          setEditingDraftData(draft);
          setCaption(draft.caption || '');
          setSelectedPlatforms(draft.platforms || []);
          
          if (draft.thumbnailUrl) {
            setCoverFrames([draft.thumbnailUrl]);
            setSelectedCoverFrame(0);
          }
          
          if (draft.videoFile && draft.videoUrl) {
            const mockFile = new File([''], draft.videoFile, { 
              type: 'video/mp4',
              lastModified: Date.now()
            });
            setVideoFile(mockFile);
          }
          
          localStorage.removeItem('editingDraft');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du draft:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le draft",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, toast]);

  // Charger les données du schedule à éditer
  useEffect(() => {
    const isEditMode = searchParams?.get('edit') === 'true';
    const editType = searchParams?.get('type');
    
    if (isEditMode && editType === 'schedule') {
      try {
        const scheduleData = localStorage.getItem('editingSchedule');
        if (scheduleData) {
          const schedule = JSON.parse(scheduleData);
          
          setEditingScheduleData(schedule);
          setCaption(schedule.caption || '');
          setSelectedPlatforms(schedule.platforms || []);
          
          if (schedule.thumbnailUrl) {
            setCoverFrames([schedule.thumbnailUrl]);
            setSelectedCoverFrame(0);
          }
          
          if (schedule.videoUrl) {
            setUploadedVideoUrl(schedule.videoUrl);
            const mockFile = new File([''], 'video.mp4', { type: 'video/mp4' });
            Object.defineProperty(mockFile, 'size', { value: 1000000 });
            setVideoFile(mockFile);
          }
          
          if (schedule.scheduledAt) {
            const scheduledDate = new Date(schedule.scheduledAt._seconds * 1000);
            setScheduleDate(scheduledDate.toISOString().split('T')[0]);
            setScheduleTime(scheduledDate.toTimeString().slice(0, 5));
          }
          
          localStorage.removeItem('editingSchedule');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du schedule:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le schedule",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, toast]);

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
      setUploadedVideoUrl(null);
      setEditingDraftData(null);
      setEditingScheduleData(null);
      setCoverFrames([]);
      setSelectedCoverFrame(0);
      
      setTimeout(() => generateCoverFrames(file), 100);
    }
  };

  const generateCoverFrames = async (file: File) => {
    if (isGeneratingFrames) return;
    
    setIsGeneratingFrames(true);
    setCoverFrames([]);
    setSelectedCoverFrame(0);
    
    try {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.preload = 'metadata';
      
      await new Promise<void>((resolve, reject) => {
        video.addEventListener('loadedmetadata', () => {
          setVideoDuration(video.duration);
          resolve();
        }, { once: true });
        
        video.addEventListener('error', () => {
          reject(new Error('Erreur de chargement vidéo'));
        }, { once: true });
        
        setTimeout(() => reject(new Error('Timeout')), 10000);
      });
      
      const frameCount = 8;
      const frames: string[] = [];
      
      for (let i = 0; i < frameCount; i++) {
        const time = (video.duration / frameCount) * i;
        try {
          const frame = await generateFrameAtTime(video, time);
          frames.push(frame);
        } catch (error) {
          console.warn(`Erreur frame ${i}:`, error);
        }
      }
      
      const validFrames = frames.filter(f => f);
      setCoverFrames(validFrames);
      
      URL.revokeObjectURL(video.src);
    } catch (error) {
      console.error('Erreur génération frames:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les miniatures",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFrames(false);
    }
  };

  const generateFrameAtTime = (video: HTMLVideoElement, time: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const frameVideo = video.cloneNode() as HTMLVideoElement;
      frameVideo.currentTime = time;
      frameVideo.muted = true;
      
      const onSeeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = frameVideo.videoWidth || 640;
          canvas.height = frameVideo.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(frameVideo, 0, 0, canvas.width, canvas.height);
            const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(frameDataUrl);
          } else {
            reject(new Error('Impossible de créer le contexte canvas'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      frameVideo.addEventListener('seeked', onSeeked, { once: true });
      frameVideo.addEventListener('error', reject, { once: true });
      
      setTimeout(() => reject(new Error('Timeout')), 5000);
    });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setUploadedVideoUrl(null);
      setEditingDraftData(null);
      setEditingScheduleData(null);
      generateCoverFrames(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleCoverFrameSelect = (frameIndex: number) => {
    if (frameIndex >= 0 && frameIndex < coverFrames.length) {
      setSelectedCoverFrame(frameIndex);
    }
  };

  const handleSetCover = () => {
    if (coverFrames.length > 0 && coverFrames[selectedCoverFrame]) {
      toast({
        title: "Couverture sélectionnée",
        description: `Frame ${selectedCoverFrame + 1} définie comme couverture`,
      });
      setShowCoverModal(false);
    }
  };

  const uploadVideoToStorage = async (file: File): Promise<string> => {
    try {
      const timestamp = Date.now();
      const fileName = `videos/${timestamp}_${file.name}`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      
      const response = await fetch('/api/upload/sign', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }
      
      const result = await response.json();
      return result.downloadURL;
    } catch (error) {
      console.error('Erreur upload vidéo:', error);
      throw error;
    }
  };

  const uploadImageToStorage = async (imageDataUrl: string, fileName: string): Promise<string> => {
    try {
      if (imageDataUrl.includes('storage.googleapis.com')) {
        return imageDataUrl;
      }
      
      let blob: Blob;
      
      if (imageDataUrl.startsWith('data:')) {
        const response = await fetch(imageDataUrl);
        blob = await response.blob();
      } else if (imageDataUrl.startsWith('http')) {
        const response = await fetch(imageDataUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        blob = await response.blob();
      } else {
        const base64Data = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'image/jpeg' });
      }
      
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      
      const uploadResponse = await fetch('/api/upload/sign', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }
      
      const result = await uploadResponse.json();
      return result.downloadURL;
    } catch (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }
  };

  const getVideoUrl = async (): Promise<string> => {
    if (uploadedVideoUrl) return uploadedVideoUrl;
    if (editingDraftData?.videoUrl) {
      return editingDraftData.videoUrl;
    }
    if (editingScheduleData?.videoUrl) return editingScheduleData.videoUrl;
    
    if (!videoFile) throw new Error('Aucune vidéo disponible');
    
    const url = await uploadVideoToStorage(videoFile);
    setUploadedVideoUrl(url);
    return url;
  };

  const getThumbnailUrl = async (): Promise<string> => {
    if (coverFrames.length > 0 && coverFrames[selectedCoverFrame]) {
      const timestamp = Date.now();
      const thumbnailFileName = `thumbnails/${timestamp}_thumbnail.jpg`;
      return await uploadImageToStorage(coverFrames[selectedCoverFrame], thumbnailFileName);
    }
    if (editingScheduleData?.thumbnailUrl) {
      return editingScheduleData.thumbnailUrl;
    }
    return '';
  };

  const resetForm = () => {
    setVideoFile(null);
    setCaption('');
    setSelectedPlatforms(platforms.length > 0 ? [platforms[0].id] : []);
    setCoverFrames([]);
    setSelectedCoverFrame(0);
    setUploadedVideoUrl(null);
    setEditingDraftData(null);
    setEditingScheduleData(null);
    setUploadProgress(0);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(tomorrow.getHours() + 1, 0, 0, 0);
    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTime(tomorrow.toTimeString().slice(0, 5));
  };

  const handlePublishNow = async () => {
    if (!videoFile || selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez sélectionner une vidéo et au moins une plateforme",
      });
      return;
    }

    // Avertir si le caption est vide (optionnel)
    if (!caption.trim()) {
      toast({
        title: "Caption vide",
        description: "Vous publiez sans description. Vous pouvez ajouter une description si vous le souhaitez.",
        duration: 3000,
      });
    }

    try {
      toast({
        title: "Publication en cours",
        description: "Veuillez patienter...",
        duration: 0,
      });

      const videoUrl = await getVideoUrl();
      const thumbnailUrl = await getThumbnailUrl();

      const postData = {
        userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
        caption,
        videoFile: videoFile.name,
        videoUrl,
        thumbnailUrl,
        platforms: selectedPlatforms,
        scheduledAt: new Date(),
        status: 'pending',
        mediaType: 'video'
      };

      const response = await fetch('/api/publish/now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        // Vérifier si c'est un mode inbox
        if (result.inboxMode) {
          toast({
            title: "Vidéo envoyée dans TikTok !",
            description: result.instructions,
            duration: 8000,
          });
          
          // Afficher une notification supplémentaire avec les étapes
          setTimeout(() => {
            toast({
              title: "📱 Étapes suivantes",
              description: result.nextSteps?.join(' • ') || "Ouvrez TikTok pour finaliser la publication",
              duration: 10000,
            });
          }, 2000);
        } else if (result.directPostSuccess) {
          // Publication directe réussie
          toast({
            title: "🎉 Publication directe réussie !",
            description: `Vidéo publiée avec succès sur TikTok (${result.privacyLevel})`,
            duration: 6000,
          });
        } else {
          // Publication en cours
          toast({
            title: "Publication en cours",
            description: result.message || "Votre vidéo est en cours de publication",
            duration: 5000,
          });
        }
        resetForm();
      } else {
        throw new Error(result.error || 'Erreur de publication');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Erreur de publication',
      });
    }
  };

  const handleSchedule = async () => {
    if (!videoFile || selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez sélectionner une vidéo et au moins une plateforme",
      });
      return;
    }

    try {
      toast({
        title: scheduleEnabled ? "Planification en cours" : "Publication en cours",
        description: "Veuillez patienter...",
        duration: 0,
      });

      const videoUrl = await getVideoUrl();
      const thumbnailUrl = await getThumbnailUrl();

      const scheduledDateTime = scheduleEnabled 
        ? new Date(`${scheduleDate}T${scheduleTime}:00`)
        : new Date();

      const postData = {
        userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
        caption,
        videoFile: videoFile.name,
        videoUrl,
        thumbnailUrl,
        platforms: selectedPlatforms,
        scheduledAt: scheduledDateTime,
        status: scheduleEnabled ? 'scheduled' : 'pending',
        mediaType: 'video'
      };

      const isEditing = editingScheduleData?.id;
      const url = isEditing ? `/api/schedules?id=${editingScheduleData.id}` : '/api/schedules';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        const action = isEditing ? 'modifié' : (scheduleEnabled ? 'programmé' : 'publié');
        toast({
          title: `Post ${action} avec succès !`,
          description: scheduleEnabled 
            ? `Programmé pour le ${scheduleDate} à ${scheduleTime}`
            : 'Publication en cours',
        });
        resetForm();
      } else {
        throw new Error(result.error || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Erreur de planification',
      });
    }
  };

  const handleSaveToDrafts = async () => {
    if (!videoFile || selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez sélectionner une vidéo et au moins une plateforme",
      });
      return;
    }

    if (isSavingDraft) return;

    setIsSavingDraft(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev >= 90 ? prev : prev + 10);
      }, 200);

      const videoUrl = await getVideoUrl();
      setUploadProgress(100);
      clearInterval(progressInterval);

      const thumbnailUrl = await getThumbnailUrl();

      const draftData = {
        userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
        caption,
        videoFile: videoFile.name,
        videoUrl,
        platforms: selectedPlatforms,
        status: 'draft',
        mediaType: 'video',
        thumbnailUrl
      };

      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Brouillon sauvegardé !",
          description: "Votre vidéo a été sauvegardée avec succès",
        });
        resetForm();
      } else {
        throw new Error(result.error || 'Erreur de sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Erreur de sauvegarde',
      });
    } finally {
      setIsSavingDraft(false);
      setUploadProgress(0);
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
                  {editingScheduleData ? 'Modifier la planification' : 'Create video post'}
                </h1>
                <p className="text-gray-600 text-lg">
                  {editingScheduleData ? 'Modifiez votre planification de publication' : 'Créez et planifiez vos vidéos pour vos réseaux sociaux'}
                </p>
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
              <div className="flex flex-wrap gap-4 justify-start">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`relative group cursor-pointer transition-all duration-200 ${
                      platform.connected ? 'hover:scale-105' : 'cursor-not-allowed'
                    }`}
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <PlatformIcon
                      platform={platform.name.toLowerCase()}
                      size="md"
                      profileImageUrl={platform.connected ? platform.avatar : undefined}
                      username={platform.connected ? platform.username : undefined}
                      className={`transition-all duration-200 aspect-square rounded-full ${
                        platform.connected 
                          ? selectedPlatforms.includes(platform.id)
                            ? 'ring-4 ring-green-500 shadow-lg scale-105 border-2 border-green-500'
                            : 'shadow-md hover:shadow-lg'
                          : 'opacity-50'
                      }`}
                    />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {platform.connected ? platform.username : `${platform.name} - Non connecté`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload Area */}
          <div className="mb-8">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors cursor-pointer"
              onClick={() => !videoFile && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {videoFile ? (
                <div className="space-y-4">
                  <div className="w-32 h-20 bg-black rounded-lg mx-auto overflow-hidden relative">
                    {videoUrl && (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover rounded-lg"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">{videoFile.name}</p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Replace Media
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCoverModal(true);
                        }}
                        disabled={isGeneratingFrames || coverFrames.length === 0}
                      >
                        {isGeneratingFrames ? 'Generating...' : 'Set Cover'}
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
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">Video files only</p>
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
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Écrivez votre description ici (optionnel)..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              maxLength={2200}
            />
            <div className="flex justify-end mt-2">
              <span className="text-sm text-gray-500">{caption.length}/2200</span>
            </div>
          </div>

          {/* Post Configurations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Post configurations & tools</h3>
            <div className="flex flex-wrap gap-4">
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

      {/* Right Sidebar */}
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
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Your post will be posted at {scheduleTime} in your local time.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {scheduleEnabled ? (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSchedule}
                  disabled={!videoFile || selectedPlatforms.length === 0}
                >
                  {editingScheduleData ? 'Modifier la planification' : 'Programmer'}
                </Button>
              ) : (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handlePublishNow}
                  disabled={!videoFile || selectedPlatforms.length === 0}
                >
                  Publier maintenant
                </Button>
              )}

              <div className="w-full space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveToDrafts}
                  disabled={isSavingDraft || !videoFile || selectedPlatforms.length === 0}
                >
                  {isSavingDraft ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save to Drafts'
                  )}
                </Button>
                {isSavingDraft && uploadProgress > 0 && (
                  <div className="space-y-1">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-gray-500 text-center">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Media Preview */}
          {videoFile && videoUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Media Preview</h3>
              <div className="bg-black rounded-lg aspect-[9/16] max-w-[200px] mx-auto overflow-hidden relative">
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover rounded-lg"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-3">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">{videoFile.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cover Frame Selection Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Select Cover Frame</h2>
              <button
                onClick={() => setShowCoverModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* New Cover Image */}
              <div>
                <h3 className="text-lg font-semibold mb-4">New cover image</h3>
                <div className="bg-black rounded-lg aspect-[9/16] flex items-center justify-center max-w-[300px] mx-auto">
                  {coverFrames.length > 0 ? (
                    <img
                      src={coverFrames[selectedCoverFrame]}
                      alt="Selected cover frame"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-white text-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Generating frames...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Cover */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current cover</h3>
                <div className="bg-gray-200 rounded-lg aspect-[9/16] flex items-center justify-center max-w-[300px] mx-auto">
                  <div className="text-center">
                    <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No cover selected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Slider */}
            {coverFrames.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-600">Use this bar to select your cover frame</p>
                </div>
                <input
                  type="range"
                  min="0"
                  max={coverFrames.length - 1}
                  value={selectedCoverFrame}
                  onChange={(e) => handleCoverFrameSelect(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(selectedCoverFrame / (coverFrames.length - 1)) * 100}%, #e5e7eb ${(selectedCoverFrame / (coverFrames.length - 1)) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowCoverModal(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSetCover}
                disabled={coverFrames.length === 0}
              >
                Set as Cover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateVideoPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateVideoPostPageContent />
    </Suspense>
  );
}