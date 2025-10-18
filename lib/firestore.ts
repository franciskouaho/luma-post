import { adminDb } from './firebase';
import { FieldValue } from 'firebase-admin/firestore';

// Types pour Firestore
export interface Video {
  id: string;
  userId: string;
  title: string;
  storageKey: string;
  thumbnailKey?: string;
  duration: number;
  size: number;
  status: 'uploaded' | 'processing' | 'ready' | 'error' | 'failed';
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface Schedule {
  id: string;
  userId: string;
  videoId?: string;
  accountId?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  caption?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  platforms?: string[];
  mediaType?: string;
  scheduledAt: FieldValue;
  status: 'scheduled' | 'queued' | 'published' | 'failed' | 'draft';
  lastError?: string;
  tiktokUrl?: string;
  publishId?: string; // ID de publication TikTok
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface TikTokAccount {
  id: string;
  userId: string;
  platform: 'tiktok';
  tiktokUserId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  accessTokenEnc: string;
  refreshTokenEnc: string;
  expiresAt: FieldValue;
  isActive: boolean;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

// Service pour les vidéos
export class VideoService {
  private collection = 'videos';

  async create(video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = FieldValue.serverTimestamp();
    const docRef = await adminDb.collection(this.collection).add({
      ...video,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  async getById(id: string): Promise<Video | null> {
    const docRef = adminDb.collection(this.collection).doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as Video;
    }
    return null;
  }

  async getByUserId(userId: string, limitCount = 10, lastDoc?: any): Promise<Video[]> {
    let q = adminDb.collection(this.collection)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limitCount);

    if (lastDoc) {
      q = q.startAfter(lastDoc);
    }

    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
  }

  async update(id: string, updates: Partial<Video>): Promise<void> {
    const docRef = adminDb.collection(this.collection).doc(id);
    await docRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = adminDb.collection(this.collection).doc(id);
    await docRef.delete();
  }
}

// Service pour les planifications
export class ScheduleService {
  private collection = 'schedules';

  async create(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = FieldValue.serverTimestamp();
    const docRef = await adminDb.collection(this.collection).add({
      ...schedule,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  async getById(id: string): Promise<Schedule | null> {
    const docRef = adminDb.collection(this.collection).doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as Schedule;
    }
    return null;
  }

  async getByUserId(userId: string, status?: string, limitCount = 10): Promise<Schedule[]> {
    let q = adminDb.collection(this.collection)
      .where('userId', '==', userId)
      .orderBy('scheduledAt', 'desc')
      .limit(limitCount);

    if (status) {
      q = q.where('status', '==', status);
    }

    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Schedule[];
  }

  async getScheduledForPublishing(): Promise<Schedule[]> {
    const now = FieldValue.serverTimestamp();
    const q = adminDb.collection(this.collection)
      .where('status', '==', 'scheduled')
      .where('scheduledAt', '<=', now)
      .orderBy('scheduledAt', 'asc');

    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Schedule[];
  }

  async update(id: string, updates: Partial<Schedule>): Promise<void> {
    const docRef = adminDb.collection(this.collection).doc(id);
    await docRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = adminDb.collection(this.collection).doc(id);
    await docRef.delete();
  }
}

// Service pour les comptes TikTok
export class TikTokAccountService {
  private collection = 'accounts';

  async create(account: Omit<TikTokAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = FieldValue.serverTimestamp();
    const docRef = await adminDb.collection(this.collection).add({
      ...account,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  async getByUserId(userId: string): Promise<TikTokAccount[]> {
    const q = adminDb.collection(this.collection)
      .where('userId', '==', userId)
      .where('platform', '==', 'tiktok')
      .where('isActive', '==', true);

    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TikTokAccount[];
  }

  async getById(id: string): Promise<TikTokAccount | null> {
    const docRef = adminDb.collection(this.collection).doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as TikTokAccount;
    }
    return null;
  }

  async update(id: string, updates: Partial<TikTokAccount>): Promise<void> {
    const docRef = adminDb.collection(this.collection).doc(id);
    await docRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = adminDb.collection(this.collection).doc(id);
    await docRef.update({
      isActive: false,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

// Instances des services
export const videoService = new VideoService();
export const scheduleService = new ScheduleService();
export const tiktokAccountService = new TikTokAccountService();
