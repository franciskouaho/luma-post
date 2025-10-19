#!/bin/bash

# Script de déploiement Firebase pour la production
# Usage: ./deploy-firebase.sh [service]
# Services disponibles: firestore, storage, functions, all

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Firebase CLI est installé
if ! command -v firebase &> /dev/null; then
    log_error "Firebase CLI n'est pas installé. Installez-le avec: npm install -g firebase-tools"
    exit 1
fi

# Vérifier que l'utilisateur est connecté à Firebase
if ! firebase projects:list &> /dev/null; then
    log_error "Vous n'êtes pas connecté à Firebase. Connectez-vous avec: firebase login"
    exit 1
fi

# Fonction pour déployer Firestore
deploy_firestore() {
    log_info "Déploiement des règles Firestore..."
    firebase deploy --only firestore:rules
    log_info "Déploiement des index Firestore..."
    firebase deploy --only firestore:indexes
    log_info "✅ Firestore déployé avec succès"
}

# Fonction pour déployer Storage
deploy_storage() {
    log_info "Déploiement des règles Storage..."
    firebase deploy --only storage
    log_info "✅ Storage déployé avec succès"
}

# Fonction pour déployer Functions
deploy_functions() {
    log_info "Construction des fonctions..."
    cd functions
    npm run build
    cd ..
    
    log_info "Déploiement des fonctions..."
    firebase deploy --only functions
    log_info "✅ Functions déployé avec succès"
}

# Fonction pour déployer tout
deploy_all() {
    log_info "🚀 Déploiement complet de Firebase..."
    
    deploy_firestore
    deploy_storage
    deploy_functions
    
    log_info "🎉 Déploiement complet terminé avec succès!"
}

# Vérifier les arguments
if [ $# -eq 0 ]; then
    log_warn "Aucun service spécifié. Déploiement de tous les services..."
    deploy_all
else
    case $1 in
        "firestore")
            deploy_firestore
            ;;
        "storage")
            deploy_storage
            ;;
        "functions")
            deploy_functions
            ;;
        "all")
            deploy_all
            ;;
        *)
            log_error "Service inconnu: $1"
            log_info "Services disponibles: firestore, storage, functions, all"
            exit 1
            ;;
    esac
fi

log_info "Script terminé."
