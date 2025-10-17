#!/bin/bash

# Script de déploiement pour TikTok Crossposter
set -e

echo "🚀 Déploiement de TikTok Crossposter..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
yarn install

# Exécuter les tests
echo "🧪 Exécution des tests..."
yarn test:ci

# Build du projet
echo "🔨 Build du projet..."
yarn build

# Déployer les fonctions Firebase
echo "☁️ Déploiement des Cloud Functions..."
cd functions
yarn install
yarn build
cd ..

# Déployer Firebase (règles, index, etc.)
echo "🔥 Déploiement des règles Firebase..."
firebase deploy --only firestore:rules,firestore:indexes,storage:rules

# Déployer les Cloud Functions
echo "⚡ Déploiement des Cloud Functions..."
firebase deploy --only functions

# Déployer sur Vercel
echo "▲ Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Votre application est maintenant en ligne!"
