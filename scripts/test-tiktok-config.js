#!/usr/bin/env node

// Script pour tester la configuration TikTok
const fs = require('fs');
const path = require('path');

console.log('🔍 Test de la configuration TikTok...\n');

// Charger le fichier .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env.local non trouvé');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Vérifier les variables TikTok
console.log('📋 Configuration TikTok :');
console.log(`   Client ID: ${envVars.TIKTOK_CLIENT_ID ? '✅ Configuré' : '❌ Manquant'}`);
console.log(`   Client Secret: ${envVars.TIKTOK_CLIENT_SECRET ? '✅ Configuré' : '❌ Manquant'}`);
console.log(`   Redirect URI: ${envVars.OAUTH_REDIRECT_URI || '❌ Manquant'}`);

console.log('\n📋 Configuration Firebase :');
console.log(`   API Key: ${envVars.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configuré' : '❌ Manquant'}`);
console.log(`   Project ID: ${envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Manquant'}`);

console.log('\n📋 Configuration Chiffrement :');
console.log(`   Encryption Key: ${envVars.ENCRYPTION_KEY ? '✅ Configuré' : '❌ Manquant'}`);

// Vérifier si tout est configuré
const requiredVars = [
  'TIKTOK_CLIENT_ID',
  'TIKTOK_CLIENT_SECRET',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'ENCRYPTION_KEY'
];

const missingVars = requiredVars.filter(varName => !envVars[varName]);

if (missingVars.length === 0) {
  console.log('\n🎉 Configuration complète ! Votre application est prête.');
} else {
  console.log('\n⚠️  Variables manquantes :', missingVars.join(', '));
}

console.log('\n📝 Prochaines étapes :');
console.log('   1. Complétez les informations dans le portail TikTok');
console.log('   2. Soumettez l\'application pour review');
console.log('   3. Testez l\'authentification TikTok');
console.log('   4. Déployez sur Firebase/Vercel');
