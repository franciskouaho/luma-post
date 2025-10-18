'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
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

export default function CreateVideoPostPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedCoverFrame, setSelectedCoverFrame] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [coverFrames, setCoverFrames] = useState<string[]>([]);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleDate, setScheduleDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  });
  const [scheduleTime, setScheduleTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  });
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingDraftData, setEditingDraftData] = useState<any>(null);
  const [editingScheduleData, setEditingScheduleData] = useState<any>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  // Mémoriser l'URL de la vidéo pour éviter les re-créations
  const videoUrl = useMemo(() => {
    console.log('🔄 useMemo videoUrl déclenché:', { 
      hasVideoFile: !!videoFile, 
      hasEditingDraftData: !!editingDraftData,
      editingDraftVideoUrl: editingDraftData?.videoUrl,
      videoFileType: videoFile?.type,
      videoFileName: videoFile?.name
    });
    
    if (!videoFile) {
      console.log('❌ Pas de videoFile, retour null');
      return null;
    }
    
    // Si c'est un draft avec une URL Firebase Storage, l'utiliser directement
    if (editingDraftData?.videoUrl) {
      const videoUrl = typeof editingDraftData.videoUrl === 'string' 
        ? editingDraftData.videoUrl 
        : editingDraftData.videoUrl.downloadUrl;
      console.log('✅ Utilisation de l\'URL Firebase Storage:', videoUrl);
      return videoUrl;
    }
    
    // Sinon, créer une URL locale pour le fichier
    console.log('📁 Création d\'une URL locale pour le fichier');
    const localUrl = URL.createObjectURL(videoFile);
    console.log('📁 URL locale créée:', localUrl);
    return localUrl;
  }, [videoFile, editingDraftData]);

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

  // Charger les données du draft à éditer
  useEffect(() => {
    const isEditMode = searchParams?.get('edit') === 'true';
    if (isEditMode) {
      try {
        const draftData = localStorage.getItem('editingDraft');
        if (draftData) {
          const draft = JSON.parse(draftData);
          console.log('Chargement du draft à éditer:', draft);
          
          // Stocker les données du draft dans l'état AVANT de définir videoFile
          setEditingDraftData(draft);
          
          // Pré-remplir les champs avec les données du draft
          setCaption(draft.caption || '');
          setSelectedPlatforms(draft.platforms || []);
          
          // Si on a une thumbnail, l'afficher
          if (draft.thumbnailUrl) {
            setCoverFrames([draft.thumbnailUrl]);
            setSelectedCoverFrame(0);
          }
          
          // Charger la vidéo depuis Firebase Storage
          if (draft.videoFile) {
            console.log('🔍 Draft chargé - Données complètes:', {
              videoFile: draft.videoFile,
              videoUrl: draft.videoUrl,
              videoUrlType: typeof draft.videoUrl,
              thumbnailUrl: draft.thumbnailUrl,
              thumbnailUrlType: typeof draft.thumbnailUrl
            });
            
            // Créer un objet File simulé pour l'affichage
            // Mais on va utiliser l'URL Firebase Storage directement
            const mockFile = new File([''], draft.videoFile, { 
              type: 'video/mp4',
              lastModified: Date.now()
            });
            
            // Définir videoFile APRÈS avoir défini editingDraftData
            // Utiliser setTimeout pour s'assurer que editingDraftData est mis à jour
            setTimeout(() => {
              setVideoFile(mockFile);
              console.log('✅ videoFile défini après chargement du draft');
              console.log('✅ L\'URL Firebase Storage sera utilisée pour l\'affichage');
            }, 100);
          } else {
            console.log('⚠️ Pas de videoFile dans le draft');
          }
          
          // Nettoyer le localStorage après utilisation
          localStorage.removeItem('editingDraft');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du draft:', error);
      }
    }
  }, [searchParams]);

  // Charger les données du schedule à éditer
  useEffect(() => {
    const isEditMode = searchParams?.get('edit') === 'true';
    const editType = searchParams?.get('type');
    
    if (isEditMode && editType === 'schedule') {
      try {
        const scheduleData = localStorage.getItem('editingSchedule');
        if (scheduleData) {
          const schedule = JSON.parse(scheduleData);
          console.log('Chargement du schedule à éditer:', schedule);
          
          // Stocker les données du schedule dans l'état
          setEditingScheduleData(schedule);
          
          // Pré-remplir les champs avec les données du schedule
          setCaption(schedule.caption || '');
          setSelectedPlatforms(schedule.platforms || []);
          
          // Si on a une thumbnail, l'afficher
          if (schedule.thumbnailUrl) {
            setCoverFrames([schedule.thumbnailUrl]);
            setSelectedCoverFrame(0);
          }
          
          // Charger la vidéo depuis Firebase Storage
          if (schedule.videoUrl) {
            console.log('Chargement de la vidéo depuis:', schedule.videoUrl);
            setUploadedVideoUrl(schedule.videoUrl);
            
            // Créer un objet File factice pour maintenir la compatibilité
            const mockFile = new File([''], 'video.mp4', { type: 'video/mp4' });
            Object.defineProperty(mockFile, 'size', { value: 1000000 }); // 1MB
            setVideoFile(mockFile);
          }
          
          // Pré-remplir la date et l'heure de planification
          if (schedule.scheduledAt) {
            const scheduledDate = new Date(schedule.scheduledAt._seconds * 1000);
            setScheduleDate(scheduledDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }));
            setScheduleTime(scheduledDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }));
          }
          
          // Nettoyer le localStorage après chargement
          localStorage.removeItem('editingSchedule');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du schedule:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du schedule",
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
      setUploadedVideoUrl(null); // Réinitialiser l'URL uploadée
      // Générer les frames après un petit délai pour éviter les conflits
      setTimeout(() => generateCoverFrames(file), 100);
    }
  };

  const generateCoverFrames = (file: File) => {
    console.log('Génération des frames pour:', file.name);
    setCoverFrames([]); // Reset frames
    setSelectedCoverFrame(0); // Reset selection
    
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';
    
    video.addEventListener('loadedmetadata', () => {
      console.log('Vidéo chargée, durée:', video.duration, 'dimensions:', video.videoWidth, 'x', video.videoHeight);
      setVideoDuration(video.duration);
      
      const frameCount = 8;
      const frames: string[] = [];
      
      // Générer toutes les frames en parallèle
      const promises = [];
      
      for (let i = 0; i < frameCount; i++) {
        const time = (video.duration / frameCount) * i;
        promises.push(generateFrameAtTime(video, time, i, frames));
      }
      
      Promise.all(promises).then(() => {
        const validFrames = frames.filter(f => f);
        console.log(`${validFrames.length} frames générées avec succès`);
        setCoverFrames(validFrames);
      }).catch(error => {
        console.error('Erreur lors de la génération des frames:', error);
      });
    });
    
    video.addEventListener('error', (error) => {
      console.error('Erreur lors du chargement de la vidéo:', error);
    });
  };

  const generateFrameAtTime = (video: HTMLVideoElement, time: number, index: number, frames: string[]): Promise<void> => {
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
            frames[index] = frameDataUrl;
            console.log(`Frame ${index} générée à ${time.toFixed(2)}s`);
            resolve();
          } else {
            reject(new Error('Impossible de créer le contexte canvas'));
          }
        } catch (error) {
          console.error(`Erreur frame ${index}:`, error);
          reject(error);
        }
      };
      
      frameVideo.addEventListener('seeked', onSeeked, { once: true });
      frameVideo.addEventListener('error', () => {
        console.warn(`Erreur lors de la génération de la frame ${index}`);
        resolve(); // Continue même si une frame échoue
      }, { once: true });
      
      // Timeout pour éviter les blocages
      setTimeout(() => {
        console.warn(`Timeout pour la frame ${index}`);
        resolve();
      }, 5000);
    });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      generateCoverFrames(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleCoverFrameSelect = (frameIndex: number) => {
    console.log('Sélection de la frame:', frameIndex);
    if (frameIndex >= 0 && frameIndex < coverFrames.length) {
      setSelectedCoverFrame(frameIndex);
    }
  };

  const handleSetCover = () => {
    if (coverFrames.length > 0) {
      console.log('Frame de couverture sélectionnée:', selectedCoverFrame);
      console.log('Frame data URL:', coverFrames[selectedCoverFrame]);
      alert(`Frame ${selectedCoverFrame + 1} sélectionnée comme couverture !`);
      setShowCoverModal(false);
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
      // Upload de la vidéo vers Firebase Storage (seulement si pas déjà uploadée)
      let videoUrl = uploadedVideoUrl;
      
      // Si on vient d'un draft, utiliser l'URL du draft
      if (!videoUrl && editingDraftData?.videoUrl) {
        videoUrl = typeof editingDraftData.videoUrl === 'string' 
          ? editingDraftData.videoUrl 
          : editingDraftData.videoUrl.downloadUrl;
        console.log('📋 Utilisation de l\'URL du draft:', videoUrl);
      }
      
      // Si on vient d'un schedule, utiliser l'URL du schedule
      if (!videoUrl && editingScheduleData?.videoUrl) {
        videoUrl = editingScheduleData.videoUrl;
        console.log('📋 Utilisation de l\'URL du schedule:', videoUrl);
      }
      
      if (!videoUrl) {
        console.log('Upload de la vidéo vers Firebase Storage pour la planification...');
        videoUrl = await uploadVideoToStorage(videoFile);
        console.log('Vidéo uploadée:', videoUrl);
        setUploadedVideoUrl(videoUrl);
      } else {
        console.log('Vidéo déjà uploadée, utilisation de l\'URL existante:', videoUrl);
      }

      // Upload de la thumbnail si elle existe
      let thumbnailUrl = '';
      if (coverFrames.length > 0 && coverFrames[selectedCoverFrame]) {
        console.log('Upload de la thumbnail vers Firebase Storage pour la planification...');
        const timestamp = Date.now();
        const thumbnailFileName = `thumbnails/${timestamp}_thumbnail.jpg`;
        console.log('📤 Upload thumbnail avec nom:', thumbnailFileName);
        thumbnailUrl = await uploadImageToStorage(coverFrames[selectedCoverFrame], thumbnailFileName);
        console.log('📤 Thumbnail uploadée:', thumbnailUrl);
        console.log('📤 Nom de fichier attendu:', thumbnailFileName);
      } else if (editingScheduleData?.thumbnailUrl) {
        // Si on édite un schedule et qu'il a déjà une thumbnail, la garder
        thumbnailUrl = editingScheduleData.thumbnailUrl;
        console.log('📋 Utilisation de la thumbnail existante du schedule:', thumbnailUrl);
      }

      // Créer ou mettre à jour le post planifié
      const postData = {
        userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
        caption,
        videoFile: videoFile.name,
        videoUrl: videoUrl, // Ajouter l'URL de la vidéo
        thumbnailUrl: thumbnailUrl, // Ajouter l'URL de la thumbnail
        platforms: selectedPlatforms,
        scheduledAt: scheduleEnabled ? new Date(`${scheduleDate} ${scheduleTime}`) : new Date(),
        status: scheduleEnabled ? 'scheduled' : 'pending',
        mediaType: 'video'
      };

      console.log('Envoi du post planifié:', postData);

      // Si on édite un schedule existant, utiliser PUT, sinon POST
      const isEditing = editingScheduleData?.id;
      const url = isEditing ? `/api/schedules?id=${editingScheduleData.id}` : '/api/schedules';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Post ${isEditing ? 'modifié' : (scheduleEnabled ? 'programmé' : 'publié')} avec succès !`);
        console.log('Post créé/modifié:', result);
        
        // Reset form
        setVideoFile(null);
        setCaption('');
        setSelectedPlatforms([]);
        setEditingScheduleData(null);
        // Reset to tomorrow + 1 hour
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduleDate(tomorrow.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }));
        const nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1);
        setScheduleTime(nextHour.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }));
      } else {
        console.error('Erreur API:', result);
        alert(`Erreur lors de la ${isEditing ? 'modification' : (scheduleEnabled ? 'programmation' : 'publication')} du post: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la programmation du post');
    }
  };

  const uploadVideoToStorage = async (file: File): Promise<string> => {
    try {
      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const fileName = `videos/${timestamp}_${file.name}`;
      
      // Upload vers Firebase Storage via l'API
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
      console.log('🔍 uploadImageToStorage appelé avec:', {
        imageDataUrl: imageDataUrl.substring(0, 100) + '...',
        fileName: fileName,
        startsWithData: imageDataUrl.startsWith('data:'),
        startsWithHttp: imageDataUrl.startsWith('http'),
        length: imageDataUrl.length,
        fullUrl: imageDataUrl
      });
      
      let blob: Blob;
      
      if (imageDataUrl.startsWith('data:')) {
        // C'est une URL de données base64
        console.log('📤 Conversion base64 vers blob');
        const response = await fetch(imageDataUrl);
        blob = await response.blob();
      } else if (imageDataUrl.startsWith('http')) {
        // C'est une URL HTTP
        console.log('📤 URL HTTP détectée:', imageDataUrl);
        
        // Si c'est déjà une URL Firebase Storage, on la retourne directement
        if (imageDataUrl.includes('storage.googleapis.com')) {
          console.log('📤 URL Firebase Storage détectée, retour direct');
          return imageDataUrl;
        }
        
        // Sinon, on essaie de la fetch
        try {
          const response = await fetch(imageDataUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          blob = await response.blob();
        } catch (error) {
          console.error('❌ Erreur fetch URL HTTP:', error);
          throw error;
        }
      } else {
        // C'est probablement une chaîne base64 pure, on la convertit
        console.log('📤 Conversion base64 pure vers blob');
        const base64Data = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'image/jpeg' });
      }
      
      // Créer un fichier à partir du blob
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Upload vers Firebase Storage via l'API
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

  const handleSaveToDrafts = async () => {
    console.log('🚀 handleSaveToDrafts appelé');
    if (!videoFile || selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez sélectionner une vidéo et au moins une plateforme",
      });
      return;
    }

    if (isSavingDraft) {
      return; // Empêcher les clics multiples
    }

    setIsSavingDraft(true);
    setUploadProgress(0);

    // Toast de début
    const uploadToast = toast({
      title: "Sauvegarde du brouillon",
      description: "Upload de la vidéo en cours...",
      duration: 0, // Ne pas auto-fermer
    });

    try {
      // Simuler la progression de l'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload de la vidéo vers Firebase Storage (seulement si pas déjà uploadée)
      let videoUrl = uploadedVideoUrl;
      
      if (!videoUrl) {
        console.log('Upload de la vidéo vers Firebase Storage...');
        videoUrl = await uploadVideoToStorage(videoFile);
        console.log('Vidéo uploadée:', videoUrl);
        setUploadedVideoUrl(videoUrl);
      } else {
        console.log('Vidéo déjà uploadée, utilisation de l\'URL existante:', videoUrl);
      }

      setUploadProgress(100);
      clearInterval(progressInterval);

      // Upload de la thumbnail si elle existe
      let thumbnailUrl = '';
      if (coverFrames.length > 0 && coverFrames[selectedCoverFrame]) {
        console.log('Upload de la thumbnail vers Firebase Storage...');
        const timestamp = Date.now();
        const thumbnailFileName = `thumbnails/${timestamp}_thumbnail.jpg`;
        console.log('📤 Upload thumbnail avec nom:', thumbnailFileName);
        thumbnailUrl = await uploadImageToStorage(coverFrames[selectedCoverFrame], thumbnailFileName);
        console.log('📤 Thumbnail uploadée:', thumbnailUrl);
        console.log('📤 Nom de fichier attendu:', thumbnailFileName);
      }

      // Créer le draft avec l'URL de la vidéo
      const draftData = {
        userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
        caption,
        videoFile: videoFile.name,
        videoUrl: videoUrl, // URL de la vidéo sur Firebase Storage
        platforms: selectedPlatforms,
        status: 'draft',
        mediaType: 'video',
        thumbnailUrl: thumbnailUrl // URL de la thumbnail sur Firebase Storage
      };

      console.log('🔍 Sauvegarde du brouillon - Données complètes:', {
        videoFile: videoFile.name,
        videoUrl: videoUrl,
        videoUrlType: typeof videoUrl,
        thumbnailUrl: thumbnailUrl,
        thumbnailUrlType: typeof thumbnailUrl,
        caption: caption
      });

      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData),
      });

      const result = await response.json();

      if (response.ok) {
        // Toast de succès
        uploadToast.update({
          id: uploadToast.id,
          variant: "success",
          title: "Brouillon sauvegardé !",
          description: "Votre vidéo a été sauvegardée avec succès",
        });
        
        console.log('Draft créé:', result);
        
        // Reset form
        setVideoFile(null);
        setCaption('');
        setSelectedPlatforms([]);
        setCoverFrames([]);
        setSelectedCoverFrame(0);
        setUploadProgress(0);
      } else {
        console.error('Erreur API:', result);
        uploadToast.update({
          id: uploadToast.id,
          variant: "destructive",
          title: "Erreur de sauvegarde",
          description: result.error || "Erreur lors de la sauvegarde du brouillon",
        });
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      uploadToast.update({
        id: uploadToast.id,
        variant: "destructive",
        title: "Erreur d'upload",
        description: "Erreur lors de la sauvegarde du brouillon",
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
                        <PlatformIcon
                           platform={platform.name.toLowerCase()}
                           size="md"
                           profileImageUrl={platform.connected ? platform.avatar : undefined}
                           username={platform.connected ? platform.username : undefined}
                           className={`transition-all duration-200 aspect-square rounded-full ${
                             platform.connected 
                               ? selectedPlatforms.includes(platform.id)
                                 ? 'ring-2 ring-green-400/60 shadow-md'
                                 : 'shadow-md hover:shadow-lg'
                               : 'opacity-50'
                           }`}
                         />
                       
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
                         <div className="w-32 h-20 bg-black rounded-lg mx-auto overflow-hidden relative">
                           {videoUrl ? (
                             <video
                               src={videoUrl}
                               className="w-full h-full object-cover rounded-lg"
                               muted
                               playsInline
                               preload="metadata"
                             />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-800">
                               <div className="text-center text-white">
                                 <Play className="h-6 w-6 mx-auto mb-1" />
                                 <p className="text-xs">Draft Video</p>
                               </div>
                             </div>
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
                    <input
                      type="date"
                      value={(() => {
                        // Convertir le format "Jan 19, 2025" vers "2025-01-19"
                        const d = new Date(scheduleDate);
                        if (isNaN(d.getTime())) {
                          // Si la conversion échoue, utiliser demain
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          return tomorrow.toISOString().split('T')[0];
                        }
                        return d.toISOString().split('T')[0];
                      })()}
                      onChange={(e) => {
                        // Convertir "2025-01-19" vers "Jan 19, 2025"
                        const date = new Date(e.target.value);
                        setScheduleDate(date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }));
                      }}
                      className="flex-1 text-sm border-none outline-none bg-transparent cursor-pointer"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      value={(() => {
                        const d = new Date(`2000/01/01 ${scheduleTime}`); // Use a dummy date for time parsing
                        return d.toTimeString().slice(0, 5);
                      })()}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const date = new Date();
                        date.setHours(parseInt(hours), parseInt(minutes));
                        setScheduleTime(date.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        }));
                      }}
                      className="flex-1 text-sm border-none outline-none bg-transparent cursor-pointer"
                    />
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
                    {editingScheduleData 
                      ? (scheduleEnabled ? 'Modifier la planification' : 'Publier maintenant') 
                      : (scheduleEnabled ? 'Schedule' : 'Publish Now')
                    }
                  </Button>
                        <div className="w-full space-y-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleSaveToDrafts}
                            disabled={isSavingDraft}
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
                          {isSavingDraft && (
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
            )}
          </div>

                 {/* Media Preview */}
                 {videoFile && (
                   <div>
                     <h3 className="text-lg font-semibold mb-4">Media Preview</h3>
                     <div className="bg-black rounded-lg aspect-[9/16] max-w-[200px] mx-auto overflow-hidden relative">
                       <video
                         src={videoUrl || ''}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-7xl h-5/6 overflow-hidden flex flex-col">
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

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Two Column Layout */}
              <div className="flex-1 grid grid-cols-2 gap-6 mb-6">
                       {/* New Cover Image */}
                       <div>
                         <h3 className="text-lg font-semibold mb-4">New cover image</h3>
                         <div className="bg-black rounded-lg aspect-[9/16] flex items-center justify-center max-w-[300px] mx-auto">
                           {coverFrames.length > 0 ? (
                             <div className="w-full h-full relative">
                               <img
                                 src={coverFrames[selectedCoverFrame]}
                                 alt="Selected cover frame"
                                 className="w-full h-full object-cover rounded-lg"
                               />
                               {/* Overlay text like in the example */}
                               <div className="absolute top-4 left-4 right-4">
                                 <div className="bg-black bg-opacity-50 text-white text-sm p-2 rounded">
                                   people with this diet... aren't on a diet
                                 </div>
                               </div>
                             </div>
                           ) : (
                             <div className="text-white text-center">
                               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                               <p className="text-sm">Generating frames...</p>
                               <p className="text-xs text-gray-300 mt-1">This may take a few seconds</p>
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
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-600">Use this bar to select your cover frame</p>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, coverFrames.length - 1)}
                    value={selectedCoverFrame}
                    onChange={(e) => handleCoverFrameSelect(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={coverFrames.length === 0}
                    style={{
                      background: coverFrames.length > 0 
                        ? `linear-gradient(to right, #10b981 0%, #10b981 ${(selectedCoverFrame / Math.max(1, coverFrames.length - 1)) * 100}%, #e5e7eb ${(selectedCoverFrame / Math.max(1, coverFrames.length - 1)) * 100}%, #e5e7eb 100%)`
                        : '#e5e7eb'
                    }}
                  />
                  <style jsx>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #10b981;
                      cursor: pointer;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .slider::-moz-range-thumb {
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #10b981;
                      cursor: pointer;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                  `}</style>
                </div>
              </div>
            </div>

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