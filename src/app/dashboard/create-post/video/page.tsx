"use client";

import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Play,
  Settings,
  X,
  ChevronDown,
  Info,
  History,
  Wand2,
  Calendar,
  Clock,
  Sparkles,
  Save,
} from "lucide-react";
import TikTokSettings, {
  TikTokPostSettings,
} from "@/components/tiktok/TikTokSettings";
import { useAuth } from "@/hooks/use-auth";
import { PlatformIcon } from "@/components/ui/platform-icon";

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
  const [caption, setCaption] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Hashtags populaires par catégorie
  const popularHashtags = {
    general: [
      "#fyp",
      "#viral",
      "#trending",
      "#foryou",
      "#explore",
      "#reels",
      "#tiktok",
      "#funny",
      "#comedy",
      "#dance",
    ],
    lifestyle: [
      "#lifestyle",
      "#motivation",
      "#inspiration",
      "#selfcare",
      "#wellness",
      "#mindfulness",
      "#positivity",
      "#growth",
      "#success",
      "#happiness",
    ],
    tech: [
      "#tech",
      "#innovation",
      "#ai",
      "#coding",
      "#programming",
      "#startup",
      "#entrepreneur",
      "#business",
      "#digital",
      "#future",
    ],
    food: [
      "#food",
      "#cooking",
      "#recipe",
      "#delicious",
      "#yummy",
      "#foodie",
      "#homemade",
      "#healthy",
      "#tasty",
      "#chef",
    ],
    travel: [
      "#travel",
      "#wanderlust",
      "#adventure",
      "#explore",
      "#vacation",
      "#trip",
      "#journey",
      "#destination",
      "#world",
      "#nature",
    ],
    fashion: [
      "#fashion",
      "#style",
      "#outfit",
      "#ootd",
      "#trendy",
      "#beauty",
      "#makeup",
      "#skincare",
      "#glam",
      "#chic",
    ],
  };

  // Fonctions pour gérer les hashtags
  const addHashtag = (hashtag: string) => {
    const cleanHashtag = hashtag.startsWith("#") ? hashtag : `#${hashtag}`;
    if (
      !selectedHashtags.includes(cleanHashtag) &&
      selectedHashtags.length < 5
    ) {
      setSelectedHashtags([...selectedHashtags, cleanHashtag]);
    }
    setHashtagInput("");
    setShowHashtagSuggestions(false);
  };

  const removeHashtag = (hashtag: string) => {
    setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag));
  };

  const handleHashtagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && hashtagInput.trim()) {
      e.preventDefault();
      addHashtag(hashtagInput.trim());
    }
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".hashtag-suggestions") &&
        !target.closest(".hashtag-input")
      ) {
        setShowHashtagSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mettre à jour le caption avec les hashtags
  const updateCaptionWithHashtags = () => {
    const hashtagsText = selectedHashtags.join(" ");
    const baseCaption = caption.replace(/\s*#\w+/g, "").trim();
    return baseCaption + (hashtagsText ? `\n\n${hashtagsText}` : "");
  };

  const [selectedCoverFrame, setSelectedCoverFrame] = useState<number>(0);
  const [videoDuration] = useState<number>(0);
  const [coverFrames, setCoverFrames] = useState<string[]>([]);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingDraftData, setEditingDraftData] = useState<{
    id: string;
    videoUrl: string;
    caption: string;
    thumbnailUrl?: string;
  } | null>(null);
  const [editingScheduleData, setEditingScheduleData] = useState<{
    id: string;
    videoUrl: string;
    caption: string;
    thumbnailUrl?: string;
    scheduledAt: string;
  } | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isGeneratingFrames, setIsGeneratingFrames] = useState(false);
  const [tiktokSettings, setTiktokSettings] = useState<TikTokPostSettings>({
    privacyLevel: "PUBLIC_TO_EVERYONE",
    allowComments: true,
    allowDuet: true,
    allowStitch: true,
    commercialContent: {
      enabled: false,
      yourBrand: false,
      brandedContent: false,
    },
  });
  const [creatorInfo, setCreatorInfo] = useState<any>(null);
  const [, setLoadingCreatorInfo] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  // Fonction pour charger les informations du créateur TikTok
  const loadCreatorInfo = async (accountId: string) => {
    if (!user) return;

    setLoadingCreatorInfo(true);
    try {
      const response = await fetch(
        `/api/tiktok/creator-info?userId=${user.uid}&accountId=${accountId}`,
      );
      const data = await response.json();

      if (data.success) {
        setCreatorInfo(data.creatorInfo);
      } else {
        console.error(
          "Erreur lors du chargement des infos créateur:",
          data.error,
        );
        toast({
          title: "Erreur",
          description:
            "Impossible de charger les informations du créateur TikTok",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des infos créateur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des informations du créateur",
        variant: "destructive",
      });
    } finally {
      setLoadingCreatorInfo(false);
    }
  };

  // Charger les informations du créateur quand un compte TikTok est sélectionné
  useEffect(() => {
    if (selectedPlatforms.length > 0 && accounts.length > 0) {
      const tiktokAccount = accounts.find((acc) =>
        selectedPlatforms.includes(acc.id),
      );
      if (tiktokAccount) {
        loadCreatorInfo(tiktokAccount.id);
      }
    }
  }, [selectedPlatforms, accounts, user]);

  // Initialiser les dates par défaut
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(tomorrow.getHours() + 1, 0, 0, 0);

    setScheduleDate(tomorrow.toISOString().split("T")[0]);
    setScheduleTime(tomorrow.toTimeString().slice(0, 5));
  }, []);

  // Mémoriser l'URL de la vidéo
  const videoUrl = useMemo(() => {
    if (!videoFile) return null;

    if (uploadedVideoUrl) {
      return uploadedVideoUrl;
    }

    if (editingDraftData?.videoUrl) {
      return editingDraftData.videoUrl;
    }

    if (editingScheduleData?.videoUrl) {
      return editingScheduleData.videoUrl;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile, uploadedVideoUrl, editingDraftData, editingScheduleData]);

  // Nettoyer les URLs d'objet lors du démontage
  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Charger les comptes connectés
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/accounts");
        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts || []);

          const platformMap: { [key: string]: Platform } = {};

          data.accounts.forEach((account: TikTokAccount) => {
            if (account.platform === "tiktok") {
              platformMap[account.id] = {
                id: account.id,
                name: "TikTok",
                icon: "♪",
                color: "bg-black",
                connected: true,
                username: account.displayName || account.username,
                avatar: account.avatarUrl,
                displayName: account.displayName,
                accountId: account.id,
              };
            }
          });

          setPlatforms(Object.values(platformMap));

          const firstTikTokAccount = data.accounts.find(
            (account: TikTokAccount) => account.platform === "tiktok",
          );
          if (firstTikTokAccount) {
            setSelectedPlatforms([firstTikTokAccount.id]);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des comptes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Charger les données du draft à éditer
  useEffect(() => {
    const isEditMode = searchParams?.get("edit") === "true";
    const editType = searchParams?.get("type");

    if (isEditMode && editType === "draft") {
      try {
        const draftData = localStorage.getItem("editingDraft");
        if (draftData) {
          const draft = JSON.parse(draftData);

          setEditingDraftData(draft);
          setCaption(draft.caption || "");
          setSelectedPlatforms(draft.platforms || []);

          if (draft.thumbnailUrl) {
            setCoverFrames([draft.thumbnailUrl]);
            setSelectedCoverFrame(0);
          }

          if (draft.videoFile && draft.videoUrl) {
            const mockFile = new File([""], draft.videoFile, {
              type: "video/mp4",
              lastModified: Date.now(),
            });
            setVideoFile(mockFile);
          }

          localStorage.removeItem("editingDraft");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du draft:", error);
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
    const isEditMode = searchParams?.get("edit") === "true";
    const editType = searchParams?.get("type");

    if (isEditMode && editType === "schedule") {
      try {
        const scheduleData = localStorage.getItem("editingSchedule");
        if (scheduleData) {
          const schedule = JSON.parse(scheduleData);

          setEditingScheduleData(schedule);
          setCaption(schedule.caption || "");
          setSelectedPlatforms(schedule.platforms || []);

          if (schedule.thumbnailUrl) {
            setCoverFrames([schedule.thumbnailUrl]);
            setSelectedCoverFrame(0);
          }

          if (schedule.videoUrl) {
            setUploadedVideoUrl(schedule.videoUrl);
            const mockFile = new File([""], "video.mp4", { type: "video/mp4" });
            Object.defineProperty(mockFile, "size", { value: 1000000 });
            setVideoFile(mockFile);
          }

          if (schedule.scheduledAt) {
            const scheduledDate = new Date(
              schedule.scheduledAt._seconds * 1000,
            );
            setScheduleDate(scheduledDate.toISOString().split("T")[0]);
            setScheduleTime(scheduledDate.toTimeString().slice(0, 5));
          }

          localStorage.removeItem("editingSchedule");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du schedule:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le schedule",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, toast]);

  const handlePlatformSelect = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform?.connected) return;

    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId],
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
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.preload = "metadata";

      await new Promise<void>((resolve, reject) => {
        video.addEventListener(
          "loadedmetadata",
          () => {
            resolve();
          },
          { once: true },
        );

        video.addEventListener(
          "error",
          () => {
            reject(new Error("Erreur de chargement vidéo"));
          },
          { once: true },
        );

        setTimeout(() => reject(new Error("Timeout")), 10000);
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

      const validFrames = frames.filter((f) => f);
      setCoverFrames(validFrames);

      URL.revokeObjectURL(video.src);
    } catch (error) {
      console.error("Erreur génération frames:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les miniatures",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFrames(false);
    }
  };

  const generateFrameAtTime = (
    video: HTMLVideoElement,
    time: number,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const frameVideo = video.cloneNode() as HTMLVideoElement;
      frameVideo.currentTime = time;
      frameVideo.muted = true;

      const onSeeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = frameVideo.videoWidth || 640;
          canvas.height = frameVideo.videoHeight || 480;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(frameVideo, 0, 0, canvas.width, canvas.height);
            const frameDataUrl = canvas.toDataURL("image/jpeg", 0.8);
            resolve(frameDataUrl);
          } else {
            reject(new Error("Impossible de créer le contexte canvas"));
          }
        } catch (error) {
          reject(error);
        }
      };

      frameVideo.addEventListener("seeked", onSeeked, { once: true });
      frameVideo.addEventListener("error", reject, { once: true });

      setTimeout(() => reject(new Error("Timeout")), 5000);
    });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setUploadedVideoUrl(null);
      setEditingDraftData(null);
      setEditingScheduleData(null);
      generateCoverFrames(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
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
      formData.append("file", file);
      formData.append("fileName", fileName);

      const response = await fetch("/api/upload/sign", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload");
      }

      const result = await response.json();
      return result.downloadURL;
    } catch (error) {
      console.error("Erreur upload vidéo:", error);
      throw error;
    }
  };

  const uploadImageToStorage = async (
    imageDataUrl: string,
    fileName: string,
  ): Promise<string> => {
    try {
      if (imageDataUrl.includes("storage.googleapis.com")) {
        return imageDataUrl;
      }

      let blob: Blob;

      if (imageDataUrl.startsWith("data:")) {
        const response = await fetch(imageDataUrl);
        blob = await response.blob();
      } else if (imageDataUrl.startsWith("http")) {
        const response = await fetch(imageDataUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        blob = await response.blob();
      } else {
        const base64Data = imageDataUrl.replace(
          /^data:image\/[a-z]+;base64,/,
          "",
        );
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: "image/jpeg" });
      }

      const file = new File([blob], fileName, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);

      const uploadResponse = await fetch("/api/upload/sign", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Erreur lors de l'upload de l'image");
      }

      const result = await uploadResponse.json();
      return result.downloadURL;
    } catch (error) {
      console.error("Erreur upload image:", error);
      throw error;
    }
  };

  const getVideoUrl = async (): Promise<string> => {
    if (uploadedVideoUrl) return uploadedVideoUrl;
    if (editingDraftData?.videoUrl) {
      return editingDraftData.videoUrl;
    }
    if (editingScheduleData?.videoUrl) return editingScheduleData.videoUrl;

    if (!videoFile) throw new Error("Aucune vidéo disponible");

    const url = await uploadVideoToStorage(videoFile);
    setUploadedVideoUrl(url);
    return url;
  };

  const getThumbnailUrl = async (): Promise<string> => {
    if (coverFrames.length > 0 && coverFrames[selectedCoverFrame]) {
      const timestamp = Date.now();
      const thumbnailFileName = `thumbnails/${timestamp}_thumbnail.jpg`;
      return await uploadImageToStorage(
        coverFrames[selectedCoverFrame],
        thumbnailFileName,
      );
    }
    if (editingScheduleData?.thumbnailUrl) {
      return editingScheduleData.thumbnailUrl;
    }
    return "";
  };

  const resetForm = () => {
    setVideoFile(null);
    setCaption("");
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
    setScheduleDate(tomorrow.toISOString().split("T")[0]);
    setScheduleTime(tomorrow.toTimeString().slice(0, 5));
  };

  const handlePublishNow = async () => {
    if (!videoFile || selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description:
          "Veuillez sélectionner une vidéo et au moins une plateforme",
      });
      return;
    }

    if (!caption.trim()) {
      toast({
        title: "Caption vide",
        description:
          "Vous publiez sans description. Vous pouvez ajouter une description si vous le souhaitez.",
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
        userId: "FGcdXcRXVoVfsSwJIciurCeuCXz1",
        caption,
        videoFile: videoFile.name,
        videoUrl,
        thumbnailUrl,
        platforms: selectedPlatforms,
        scheduledAt: new Date(),
        status: "pending",
        mediaType: "video",
        tiktokSettings: selectedPlatforms.some(
          (id) => accounts.find((acc) => acc.id === id)?.platform === "tiktok",
        )
          ? tiktokSettings
          : undefined,
      };

      const response = await fetch("/api/publish/now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.inboxMode) {
          toast({
            title: "Vidéo envoyée dans TikTok !",
            description: result.instructions,
            duration: 8000,
          });

          setTimeout(() => {
            toast({
              title: "📱 Étapes suivantes",
              description:
                result.nextSteps?.join(" • ") ||
                "Ouvrez TikTok pour finaliser la publication",
              duration: 10000,
            });
          }, 2000);
        } else if (result.directPostSuccess) {
          toast({
            title: "🎉 Publication directe réussie !",
            description: `Vidéo publiée avec succès sur TikTok (${result.privacyLevel})`,
            duration: 6000,
          });
        } else {
          toast({
            title: "Publication en cours",
            description:
              result.message || "Votre vidéo est en cours de publication",
            duration: 5000,
          });
        }
        resetForm();
      } else {
        throw new Error(result.error || "Erreur de publication");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Erreur de publication",
      });
    }
  };

  const handleSchedule = async () => {
    if (!videoFile || selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description:
          "Veuillez sélectionner une vidéo et au moins une plateforme",
      });
      return;
    }

    try {
      toast({
        title: scheduleEnabled
          ? "Planification en cours"
          : "Publication en cours",
        description: "Veuillez patienter...",
        duration: 0,
      });

      const videoUrl = await getVideoUrl();
      const thumbnailUrl = await getThumbnailUrl();

      const scheduledDateTime = scheduleEnabled
        ? new Date(`${scheduleDate}T${scheduleTime}:00`)
        : new Date();

      const postData = {
        userId: "FGcdXcRXVoVfsSwJIciurCeuCXz1",
        caption,
        videoFile: videoFile.name,
        videoUrl,
        thumbnailUrl,
        platforms: selectedPlatforms,
        scheduledAt: scheduledDateTime,
        status: scheduleEnabled ? "scheduled" : "pending",
        mediaType: "video",
        tiktokSettings: selectedPlatforms.some(
          (id) => accounts.find((acc) => acc.id === id)?.platform === "tiktok",
        )
          ? tiktokSettings
          : undefined,
      };

      const isEditing = editingScheduleData?.id;
      const url = isEditing
        ? `/api/schedules?id=${editingScheduleData.id}`
        : "/api/schedules";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        const action = isEditing
          ? "modifié"
          : scheduleEnabled
            ? "programmé"
            : "publié";
        toast({
          title: `Post ${action} avec succès !`,
          description: scheduleEnabled
            ? `Programmé pour le ${scheduleDate} à ${scheduleTime}`
            : "Publication en cours",
        });
        resetForm();
      } else {
        throw new Error(result.error || "Erreur");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Erreur de planification",
      });
    }
  };

  const handleSaveToDrafts = async () => {
    if (!videoFile || selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description:
          "Veuillez sélectionner une vidéo et au moins une plateforme",
      });
      return;
    }

    if (isSavingDraft) return;

    setIsSavingDraft(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 200);

      const videoUrl = await getVideoUrl();
      setUploadProgress(100);
      clearInterval(progressInterval);

      const thumbnailUrl = await getThumbnailUrl();

      const draftData = {
        userId: "FGcdXcRXVoVfsSwJIciurCeuCXz1",
        caption,
        videoFile: videoFile.name,
        videoUrl,
        platforms: selectedPlatforms,
        status: "draft",
        mediaType: "video",
        thumbnailUrl,
      };

      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        throw new Error(result.error || "Erreur de sauvegarde");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Erreur de sauvegarde",
      });
    } finally {
      setIsSavingDraft(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      {/* Modern Header with Sticky Navigation */}
      <div className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {editingScheduleData ? "Edit Schedule" : "Create Video Post"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {editingScheduleData
                  ? "Modifiez votre planification"
                  : "Créez et planifiez vos vidéos"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveToDrafts}
                disabled={
                  isSavingDraft || !videoFile || selectedPlatforms.length === 0
                }
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSavingDraft ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={scheduleEnabled ? handleSchedule : handlePublishNow}
                disabled={!videoFile || selectedPlatforms.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {scheduleEnabled ? (
                  <>
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Publish Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Select Platform
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 mt-3">
                    Loading accounts...
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformSelect(platform.id)}
                      disabled={!platform.connected}
                      className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-purple-500 bg-purple-50 shadow-sm scale-105"
                          : platform.connected
                            ? "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            : "border-slate-100 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <PlatformIcon
                        platform={platform.name.toLowerCase()}
                        size="sm"
                        profileImageUrl={
                          platform.connected ? platform.avatar : undefined
                        }
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-slate-900">
                          {platform.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {platform.connected
                            ? platform.username
                            : "Not connected"}
                        </div>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Upload Video
              </h3>

              {!videoFile ? (
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer group ${
                    isDragging
                      ? "border-purple-500 bg-purple-50/50 scale-[0.99]"
                      : "border-slate-300 hover:border-purple-400 hover:bg-slate-50/50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                        isDragging
                          ? "bg-purple-500 scale-110 shadow-lg shadow-purple-500/30"
                          : "bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                      }`}
                    >
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900 mb-1">
                      {isDragging
                        ? "Drop your video here"
                        : "Click or drag to upload"}
                    </p>
                    <p className="text-sm text-slate-500">
                      MP4, MOV, or WebM • Max 500MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    {videoUrl && (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <button
                      onClick={() => setVideoFile(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Play className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {videoFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Ready to publish
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCoverModal(true)}
                        disabled={
                          isGeneratingFrames || coverFrames.length === 0
                        }
                        className="px-4 py-2 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingFrames ? "Generating..." : "Set Cover"}
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-all duration-200"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Caption & Hashtags */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Caption & Hashtags
              </h3>

              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here... (optional)"
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 bg-white"
                  maxLength={2200}
                />
                <div className="absolute bottom-3 right-3">
                  <span className="text-xs text-slate-400 bg-white/90 px-2 py-1 rounded-md">
                    {caption.length}/2200
                  </span>
                </div>
              </div>

              {/* Hashtags */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Hashtags
                  </h4>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {selectedHashtags.length}/5
                  </span>
                </div>

                {selectedHashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedHashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-lg text-sm font-medium group hover:from-purple-200 hover:to-purple-100 transition-all duration-200 shadow-sm"
                      >
                        {hashtag}
                        <button
                          onClick={() => removeHashtag(hashtag)}
                          className="hover:bg-purple-300/50 rounded-full p-0.5 transition-colors duration-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative hashtag-input">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onFocus={() => setShowHashtagSuggestions(true)}
                    onKeyPress={handleHashtagInputKeyPress}
                    placeholder="Add hashtag and press Enter..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 bg-white"
                  />

                  {showHashtagSuggestions && (
                    <div className="hashtag-suggestions absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-80 overflow-y-auto">
                      <div className="p-4">
                        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                          Popular hashtags
                        </h5>
                        {Object.entries(popularHashtags).map(
                          ([category, hashtags]) => (
                            <div key={category} className="mb-4 last:mb-0">
                              <h6 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                                {category}
                              </h6>
                              <div className="flex flex-wrap gap-2">
                                {hashtags
                                  .filter(
                                    (hashtag) =>
                                      !selectedHashtags.includes(hashtag) &&
                                      hashtag
                                        .toLowerCase()
                                        .includes(hashtagInput.toLowerCase()),
                                  )
                                  .map((hashtag) => (
                                    <button
                                      key={hashtag}
                                      onClick={() => addHashtag(hashtag)}
                                      disabled={selectedHashtags.length >= 5}
                                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                      {hashtag}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Advanced Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 group">
                  <Sparkles className="w-4 h-4 text-slate-600 group-hover:text-purple-600 transition-colors" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">
                    AI Caption
                  </span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 group">
                  <History className="w-4 h-4 text-slate-600 group-hover:text-purple-600 transition-colors" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">
                    Past Captions
                  </span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 group">
                  <Wand2 className="w-4 h-4 text-slate-600 group-hover:text-purple-600 transition-colors" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">
                    Processing
                  </span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 group">
                  <Settings className="w-4 h-4 text-slate-600 group-hover:text-purple-600 transition-colors" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">
                    TikTok Config
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* TikTok Settings */}
            {selectedPlatforms.length > 0 &&
              selectedPlatforms.some(
                (id) =>
                  accounts.find((acc) => acc.id === id)?.platform === "tiktok",
              ) && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 sticky top-24">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    TikTok Settings
                  </h3>
                  <TikTokSettings
                    creatorInfo={creatorInfo}
                    onSettingsChange={setTiktokSettings}
                    initialSettings={tiktokSettings}
                  />
                </div>
              )}

            {/* Schedule */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  Schedule Post
                </h3>
                <button
                  onClick={() => setScheduleEnabled(!scheduleEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                    scheduleEnabled
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 shadow-md shadow-purple-500/30"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      scheduleEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {scheduleEnabled && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      <Calendar className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm text-slate-900 transition-all duration-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      <Clock className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm text-slate-900 transition-all duration-200 bg-white"
                    />
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-purple-700">
                      Your post will be published at {scheduleTime} (local time)
                    </p>
                  </div>
                </div>
              )}

              {/* Media Preview */}
              {videoFile && videoUrl && (
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-slate-700 mb-3">
                    Preview
                  </h4>
                  <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl aspect-[9/16] max-w-[200px] mx-auto overflow-hidden shadow-lg group">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isSavingDraft && uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700">
                      Uploading...
                    </span>
                    <span className="text-xs font-medium text-purple-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Frame Selection Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Select Cover Frame
              </h2>
              <button
                onClick={() => setShowCoverModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* New Cover Image */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  New cover image
                </h3>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl aspect-[9/16] flex items-center justify-center max-w-[300px] mx-auto shadow-xl">
                  {coverFrames.length > 0 ? (
                    <img
                      src={coverFrames[selectedCoverFrame]}
                      alt="Selected cover frame"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="text-white text-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white mx-auto mb-2"></div>
                      <p className="text-sm">Generating frames...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Cover */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Current cover
                </h3>
                <div className="bg-slate-100 rounded-2xl aspect-[9/16] flex items-center justify-center max-w-[300px] mx-auto">
                  <div className="text-center">
                    <Info className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No cover selected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Slider */}
            {coverFrames.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-purple-600" />
                  <p className="text-sm text-slate-600">
                    Use this bar to select your cover frame
                  </p>
                </div>
                <input
                  type="range"
                  min="0"
                  max={coverFrames.length - 1}
                  value={selectedCoverFrame}
                  onChange={(e) =>
                    handleCoverFrameSelect(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${(selectedCoverFrame / (coverFrames.length - 1)) * 100}%, rgb(226 232 240) ${(selectedCoverFrame / (coverFrames.length - 1)) * 100}%, rgb(226 232 240) 100%)`,
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowCoverModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSetCover}
                disabled={coverFrames.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set as Cover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateVideoPostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <CreateVideoPostPageContent />
    </Suspense>
  );
}
