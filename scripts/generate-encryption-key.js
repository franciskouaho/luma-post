#!/usr/bin/env node

const crypto = require('crypto');

// Générer une clé de 32 bytes (256 bits) pour AES-256
const key = crypto.randomBytes(32);

// Encoder en base64
const base64Key = key.toString('base64');

console.log('🔐 Clé de chiffrement générée :');
console.log('');
console.log(`ENCRYPTION_KEY=${base64Key}`);
console.log('');
console.log('📋 Copiez cette clé dans votre fichier .env.local');
console.log('');
console.log('⚠️  IMPORTANT : Gardez cette clé secrète et ne la partagez jamais !');
