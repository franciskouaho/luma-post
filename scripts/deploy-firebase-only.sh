#!/bin/bash

# Script de déploiement Firebase ultra-simplifié
set -e

echo "🔥 Déploiement Firebase TikTok Crossposter..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "firebase.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Vérifier Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "📦 Installation de Firebase CLI..."
    npm install -g firebase-tools
fi

echo "🔐 Connexion à Firebase..."
firebase login

echo "🔧 Initialisation du projet Firebase..."
firebase init --project lumapost-38e61

echo "📝 Déploiement des règles Firestore..."
firebase deploy --only firestore:rules

echo "📁 Déploiement des règles Storage..."
firebase deploy --only storage:rules

echo "⚡ Déploiement des Cloud Functions (inclut Cloud Tasks)..."
cd functions
yarn install
yarn build
cd ..
firebase deploy --only functions

echo "🔑 Configuration des secrets TikTok..."
echo "Vous allez être invité à saisir les secrets suivants :"
echo "- TIKTOK_CLIENT_ID"
echo "- TIKTOK_CLIENT_SECRET" 
echo "- ENCRYPTION_KEY (générez une clé 32 bytes base64)"
echo "- BUCKET_NAME"

firebase functions:secrets:set TIKTOK_CLIENT_ID
firebase functions:secrets:set TIKTOK_CLIENT_SECRET
firebase functions:secrets:set ENCRYPTION_KEY
firebase functions:secrets:set BUCKET_NAME

echo "✅ Déploiement Firebase terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez les variables d'environnement dans Vercel"
echo "2. Déployez l'application Next.js"
echo "3. Testez la connexion Google et TikTok"
echo ""
echo "🌐 Votre application est prête pour la production !"
echo "🎯 Cloud Tasks est automatiquement configuré par Firebase !"
