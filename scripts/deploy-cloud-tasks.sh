#!/bin/bash

# Script pour déployer et tester Cloud Tasks
set -e

echo "🚀 Déploiement des Cloud Tasks..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "firebase.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Installer les dépendances des fonctions
echo "📦 Installation des dépendances des fonctions..."
cd functions
yarn install
yarn build
cd ..

# Déployer les Cloud Functions
echo "⚡ Déploiement des Cloud Functions..."
firebase deploy --only functions

# Attendre que les fonctions soient déployées
echo "⏳ Attente du déploiement..."
sleep 10

# Créer la queue Cloud Tasks
echo "📋 Création de la queue Cloud Tasks..."
curl -X POST https://us-central1-lumapost-38e61.cloudfunctions.net/createTaskQueue \
  -H "Content-Type: application/json" \
  -d '{}' || echo "⚠️ Erreur lors de la création de la queue (peut-être déjà existante)"

echo "✅ Déploiement terminé !"
echo ""
echo "🔍 Vérifications :"
echo "1. Allez dans Firebase Console → Functions"
echo "2. Vérifiez que les fonctions sont déployées"
echo "3. Testez la création de tâches depuis l'interface"
echo ""
echo "🌐 Votre application est prête !"
