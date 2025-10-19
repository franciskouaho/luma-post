# Configuration Firebase pour la Production

Ce document explique comment configurer et déployer Firebase pour la production.

## 🚀 Services Configurés

### 1. Firestore Database

- **Règles de sécurité** : Configurées pour les workspaces, utilisateurs, vidéos, etc.
- **Index** : Optimisés pour les requêtes complexes
- **Localisation** : Europe (eur3)

### 2. Storage

- **Règles de sécurité** :
  - Uploads de vidéos (max 500MB)
  - Miniatures d'images (max 10MB)
  - Fichiers temporaires (max 100MB)
  - Support des workspaces partagés
- **Types de fichiers** : Validation automatique des types MIME

### 3. Functions

- **Runtime** : Node.js 18
- **Mémoire** : 256MB
- **Timeout** : 60s
- **Pré-déploiement** : Lint + Build automatiques

## 📋 Prérequis

1. **Firebase CLI** installé :

   ```bash
   npm install -g firebase-tools
   ```

2. **Connexion Firebase** :

   ```bash
   firebase login
   ```

3. **Projet Firebase** configuré :
   ```bash
   firebase use --add
   ```

## 🛠️ Déploiement

### Déploiement automatique

Utilisez le script fourni :

```bash
# Déployer tous les services
./deploy-firebase.sh all

# Déployer un service spécifique
./deploy-firebase.sh firestore
./deploy-firebase.sh storage
./deploy-firebase.sh functions
```

### Déploiement manuel

```bash
# Règles Firestore
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Règles Storage
firebase deploy --only storage

# Functions
firebase deploy --only functions
```

## 🔧 Configuration des Variables d'Environnement

Créez un fichier `.env.production` avec :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# TikTok API
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_REDIRECT_URI=https://your-domain.com/api/auth/tiktok/callback

# Autres configurations
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🔒 Sécurité

### Règles Firestore

- Accès basé sur l'authentification utilisateur
- Vérification des permissions de workspace
- Isolation des données par utilisateur et workspace

### Règles Storage

- Validation des types de fichiers
- Limitation de la taille des fichiers
- Accès partagé pour les workspaces
- Assets publics en lecture seule

## 📊 Monitoring

### Logs des Functions

```bash
firebase functions:log
```

### Monitoring Firestore

- Utilisez la console Firebase pour surveiller l'utilisation
- Configurez des alertes pour les quotas

### Monitoring Storage

- Surveillez l'utilisation de l'espace de stockage
- Configurez des alertes pour les coûts

## 🚨 Dépannage

### Erreurs de déploiement

1. Vérifiez que vous êtes connecté : `firebase login`
2. Vérifiez le projet actuel : `firebase use`
3. Vérifiez les logs : `firebase functions:log`

### Erreurs de règles

1. Testez les règles avec l'émulateur Firebase
2. Vérifiez la syntaxe des règles
3. Utilisez la console Firebase pour tester

## 📈 Optimisations

### Performance

- Index Firestore optimisés
- Règles Storage avec validation côté serveur
- Functions avec mémoire et timeout appropriés

### Coûts

- Règles restrictives pour éviter les lectures inutiles
- Limitation de la taille des fichiers
- Nettoyage automatique des fichiers temporaires

## 🔄 Maintenance

### Mise à jour des règles

1. Modifiez les fichiers de règles
2. Testez avec l'émulateur
3. Déployez avec le script

### Mise à jour des Functions

1. Modifiez le code dans `/functions`
2. Testez localement
3. Déployez avec `./deploy-firebase.sh functions`

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation Firebase
2. Vérifiez les logs d'erreur
3. Testez avec l'émulateur Firebase
