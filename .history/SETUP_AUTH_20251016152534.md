# Configuration de l'authentification Google

## 🚀 Configuration rapide

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Configuration Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez **Authentication** dans le menu de gauche
4. Dans l'onglet **Sign-in method**, activez **Google**
5. Configurez le domaine autorisé (ex: `localhost:3000` pour le dev)
6. Récupérez les clés de configuration dans **Project Settings** > **General** > **Your apps**

### 3. Démarrage de l'application

```bash
# Installer les dépendances
yarn install

# Démarrer le serveur de développement
yarn dev
```

L'application sera accessible sur `http://localhost:3000` et redirigera automatiquement vers la page de connexion.

## 🎨 Fonctionnalités

- ✅ Connexion avec Google via Firebase Auth
- ✅ Interface moderne avec shadcn/ui
- ✅ Gestion des états de chargement
- ✅ Déconnexion sécurisée
- ✅ Design responsive
- ✅ Thème sombre/clair supporté

## 📁 Structure des fichiers

```
src/
├── app/
│   ├── auth/
│   │   └── page.tsx          # Page de connexion
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Redirection vers /auth
├── components/
│   ├── auth/
│   │   └── google-signin-button.tsx  # Composant de connexion
│   └── ui/
│       ├── button.tsx        # Composant Button shadcn/ui
│       └── card.tsx          # Composant Card shadcn/ui
└── lib/
    ├── firebase.ts           # Configuration Firebase
    └── utils.ts              # Utilitaires (cn function)
```

## 🔧 Personnalisation

### Modifier le design

Les composants utilisent les variables CSS définies dans `src/app/globals.css`. Vous pouvez facilement personnaliser les couleurs en modifiant ces variables.

### Ajouter d'autres providers

Pour ajouter d'autres méthodes de connexion (Facebook, Twitter, etc.), modifiez le fichier `lib/firebase.ts` et ajoutez les providers correspondants.

## 🚨 Notes importantes

- Assurez-vous que les domaines autorisés dans Firebase incluent votre domaine de production
- Les variables d'environnement commençant par `NEXT_PUBLIC_` sont exposées côté client
- Pour la production, configurez les règles de sécurité Firestore appropriées
