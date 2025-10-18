import { adminStorage } from './firebase';

// Service Firebase Storage
export class StorageService {
  private bucket = adminStorage.bucket('lumapost-38e61.firebasestorage.app');

  // Générer une URL signée pour l'upload
  async generateSignedUploadUrl(
    fileName: string, 
    contentType: string, 
    expiresIn: number = 15 * 60 * 1000 // 15 minutes par défaut
  ): Promise<{ signedUrl: string; storageKey: string }> {
    const file = this.bucket.file(fileName);
    
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + expiresIn,
      contentType,
    });

    return {
      signedUrl,
      storageKey: fileName,
    };
  }

  // Générer une URL signée pour le téléchargement
  async generateSignedDownloadUrl(
    storageKey: string,
    expiresIn: number = 15 * 60 * 1000 // 15 minutes par défaut
  ): Promise<string> {
    const file = this.bucket.file(storageKey);
    
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresIn,
    });

    return signedUrl;
  }

  // Upload direct d'un fichier
  async uploadFile(
    file: File | Buffer | Uint8Array,
    fileName: string,
    contentType?: string,
    metadata?: { [key: string]: string }
  ): Promise<{ storageKey: string; downloadUrl: string }> {
    console.log('📤 StorageService.uploadFile démarré');
    console.log('📤 Nom de fichier:', fileName);
    console.log('📤 Type de contenu:', contentType);
    console.log('📤 Bucket:', this.bucket.name);
    
    const fileRef = this.bucket.file(fileName);
    console.log('📤 Référence fichier créée:', fileRef.name);
    
    let fileData: Buffer | Uint8Array;
    let finalContentType = contentType;
    
    if (file instanceof File) {
      console.log('📤 Conversion File vers Buffer...');
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
      finalContentType = contentType || file.type;
      console.log('📤 Taille du fichier:', fileData.length, 'bytes');
    } else {
      fileData = file;
    }
    
    console.log('📤 Sauvegarde du fichier...');
    await fileRef.save(fileData, {
      metadata: {
        contentType: finalContentType,
        ...metadata,
      },
    });
    console.log('✅ Fichier sauvegardé');

    // Rendre le fichier public (optionnel)
    console.log('📤 Rendre le fichier public...');
    await fileRef.makePublic();
    console.log('✅ Fichier rendu public');
    
    const downloadUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
    console.log('📤 URL de téléchargement:', downloadUrl);
    
    return {
      storageKey: fileName,
      downloadUrl,
    };
  }

  // Supprimer un fichier
  async deleteFile(storageKey: string): Promise<void> {
    console.log('🗑️ StorageService.deleteFile démarré');
    console.log('🗑️ Storage key:', storageKey);
    console.log('🗑️ Bucket:', this.bucket.name);
    
    const file = this.bucket.file(storageKey);
    console.log('🗑️ Référence fichier créée:', file.name);
    
    // Vérifier si le fichier existe avant de le supprimer
    const [exists] = await file.exists();
    console.log('🗑️ Fichier existe:', exists);
    
    if (!exists) {
      console.log('⚠️ Fichier n\'existe pas, pas de suppression nécessaire');
      return;
    }
    
    await file.delete();
    console.log('✅ Fichier supprimé avec succès');
  }

  // Obtenir les métadonnées d'un fichier
  async getFileMetadata(storageKey: string) {
    const file = this.bucket.file(storageKey);
    const [metadata] = await file.getMetadata();
    return metadata;
  }

  // Lister les fichiers d'un utilisateur
  async listUserFiles(userId: string, prefix = 'uploads/') {
    const [files] = await this.bucket.getFiles({
      prefix: `${prefix}${userId}/`,
    });
    
    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      timeCreated: file.metadata.timeCreated,
    }));
  }

  // Générer un nom de fichier unique
  generateFileName(userId: string, originalName: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `uploads/${userId}/${timestamp}-${randomId}.${extension}`;
  }

  // Valider le type de fichier
  validateFileType(contentType: string): boolean {
    const allowedTypes = [
      // Vidéos
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/webm',
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedTypes.includes(contentType);
  }

  // Valider la taille du fichier
  validateFileSize(size: number, maxSizeMB = 200): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }
}

// Instance du service
export const storageService = new StorageService();
