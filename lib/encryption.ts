import crypto from 'crypto';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-cbc';
  
  private static getKey(): Buffer {
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-prod';
    return crypto.scryptSync(encryptionKey, 'salt', 32);
  }

  static encrypt(plaintext: string): string {
    try {
      const key = this.getKey();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.ALGORITHM, key);
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Retourner IV + Encrypted en base64
      const combined = Buffer.concat([iv, Buffer.from(encrypted, 'hex')]);
      return combined.toString('base64');
    } catch (error) {
      console.error('Erreur chiffrement:', error);
      throw new Error('Impossible de chiffrer les données');
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const key = this.getKey();
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extraire IV (16 bytes) et données chiffrées
      const iv = combined.subarray(0, 16);
      const encrypted = combined.subarray(16);
      
      const decipher = crypto.createDecipher(this.ALGORITHM, key);
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Erreur déchiffrement:', error);
      throw new Error('Impossible de déchiffrer les données');
    }
  }
}
