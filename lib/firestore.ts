import { adminDb } from './firebase-admin';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp 
} from 'firebase/firestore';

// Types pour Firestore
export interface Video {
  id: string;
  userId: string;
  title: string;
  storageKey: string;
  thumbnailKey?: string;
  duration: number;
  size: number;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Schedule {
  id: string;
  userId: string;
  videoId: string;
  accountId: string;
  title: string;
  description?: string;
  hashtags: string[];
  scheduledAt: Timestamp;
  status: 'scheduled' | 'queued' | 'published' | 'failed';
  lastError?: string;
  tiktokUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  expiresAt: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Service pour les vidéos
export class VideoService {
  private collection = 'videos';

  async create(video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(adminDb, this.collection), {
      ...video,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  async getById(id: string): Promise<Video | null> {
    const docRef = doc(adminDb, this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Video;
    }
    return null;
  }

  async getByUserId(userId: string, limitCount = 10, lastDoc?: any): Promise<Video[]> {
    let q = query(
      collection(adminDb, this.collection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
  }

  async update(id: string, updates: Partial<Video>): Promise<void> {
    const docRef = doc(adminDb, this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(adminDb, this.collection, id);
    await deleteDoc(docRef);
  }
}

// Service pour les planifications
export class ScheduleService {
  private collection = 'schedules';

  async create(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(adminDb, this.collection), {
      ...schedule,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  async getById(id: string): Promise<Schedule | null> {
    const docRef = doc(adminDb, this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Schedule;
    }
    return null;
  }

  async getByUserId(userId: string, status?: string, limitCount = 10): Promise<Schedule[]> {
    let q = query(
      collection(adminDb, this.collection),
      where('userId', '==', userId),
      orderBy('scheduledAt', 'desc'),
      limit(limitCount)
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Schedule[];
  }

  async getScheduledForPublishing(): Promise<Schedule[]> {
    const now = Timestamp.now();
    const q = query(
      collection(adminDb, this.collection),
      where('status', '==', 'scheduled'),
      where('scheduledAt', '<=', now),
      orderBy('scheduledAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Schedule[];
  }

  async update(id: string, updates: Partial<Schedule>): Promise<void> {
    const docRef = doc(adminDb, this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(adminDb, this.collection, id);
    await deleteDoc(docRef);
  }
}

// Service pour les comptes TikTok
export class TikTokAccountService {
  private collection = 'accounts';

  async create(account: Omit<TikTokAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(adminDb, this.collection), {
      ...account,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  async getByUserId(userId: string): Promise<TikTokAccount[]> {
    const q = query(
      collection(adminDb, this.collection),
      where('userId', '==', userId),
      where('platform', '==', 'tiktok'),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TikTokAccount[];
  }

  async getById(id: string): Promise<TikTokAccount | null> {
    const docRef = doc(adminDb, this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TikTokAccount;
    }
    return null;
  }

  async update(id: string, updates: Partial<TikTokAccount>): Promise<void> {
    const docRef = doc(adminDb, this.collection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(adminDb, this.collection, id);
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
    });
  }
}

// Instances des services
export const videoService = new VideoService();
export const scheduleService = new ScheduleService();
export const tiktokAccountService = new TikTokAccountService();
