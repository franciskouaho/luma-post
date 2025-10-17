#!/bin/bash

# Script de configuration Firebase pour TikTok Crossposter
set -e

echo "🔥 Configuration Firebase pour TikTok Crossposter..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "firebase.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Vérifier que Firebase CLI est installé
if ! command -v firebase &> /dev/null; then
    echo "📦 Installation de Firebase CLI..."
    npm install -g firebase-tools
fi

# Vérifier que gcloud CLI est installé
if ! command -v gcloud &> /dev/null; then
    echo "❌ Erreur: Google Cloud CLI n'est pas installé"
    echo "Installez-le depuis: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "🔐 Connexion à Firebase..."
firebase login

echo "🔧 Initialisation du projet Firebase..."
firebase init --project lumapost-38e61

echo "☁️ Activation des services Google Cloud..."
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudtasks.googleapis.com
gcloud services enable secretmanager.googleapis.com

echo "📋 Création de la queue Cloud Tasks..."
gcloud tasks queues create publish-queue \
  --location=europe-west1 \
  --max-attempts=10 \
  --max-backoff=600s \
  --min-backoff=5s || echo "⚠️ Queue déjà existante"

echo "👤 Création du service account..."
gcloud iam service-accounts create tasks-invoker \
  --display-name="Cloud Tasks Invoker" || echo "⚠️ Service account déjà existant"

echo "🔑 Configuration des secrets Firebase..."
echo "Vous allez être invité à saisir les secrets suivants :"
echo "- TIKTOK_CLIENT_ID"
echo "- TIKTOK_CLIENT_SECRET" 
echo "- ENCRYPTION_KEY (générez une clé 32 bytes base64)"
echo "- BUCKET_NAME"

firebase functions:secrets:set TIKTOK_CLIENT_ID
firebase functions:secrets:set TIKTOK_CLIENT_SECRET
firebase functions:secrets:set ENCRYPTION_KEY
firebase functions:secrets:set BUCKET_NAME

echo "📝 Déploiement des règles Firestore..."
firebase deploy --only firestore:rules

echo "📁 Déploiement des règles Storage..."
firebase deploy --only storage:rules

echo "⚡ Déploiement des Cloud Functions..."
cd functions
yarn install
yarn build
cd ..
firebase deploy --only functions

echo "🔐 Configuration des permissions..."
gcloud run services add-iam-policy-binding publishTikTok \
  --member=serviceAccount:tasks-invoker@lumapost-38e61.iam.gserviceaccount.com \
  --role=roles/run.invoker \
  --region=europe-west1 || echo "⚠️ Permissions déjà configurées"

echo "✅ Configuration Firebase terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez les variables d'environnement dans Vercel"
echo "2. Déployez l'application Next.js"
echo "3. Testez la connexion Google et TikTok"
echo ""
echo "🌐 Votre application est prête pour la production !"
