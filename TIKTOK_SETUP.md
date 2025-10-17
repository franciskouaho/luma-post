# 🎵 Configuration TikTok Business API

## 📋 **Étapes pour obtenir les clés TikTok**

### 1. **Créer un compte TikTok Business**
- Aller sur [business.tiktok.com](https://business.tiktok.com)
- Créer un compte Business
- Vérifier votre compte

### 2. **Accéder au Developer Portal**
- Aller sur [developers.tiktok.com](https://developers.tiktok.com)
- Se connecter avec votre compte Business
- Créer une nouvelle application

### 3. **Configurer l'application**
- **App Name** : TikTok Crossposter
- **Category** : Business
- **Description** : Application pour planifier et publier des vidéos TikTok automatiquement

### 4. **Configurer les URLs de redirection**
- **Redirect URI** : `https://your-domain.com/api/auth/tiktok/callback`
- **Webhook URL** : `https://your-domain.com/api/webhooks/tiktok` (optionnel)

### 5. **Activer les permissions**
- ✅ **user.info.basic** : Informations de base de l'utilisateur
- ✅ **video.publish** : Publication de vidéos
- ✅ **video.upload** : Upload de vidéos

### 6. **Récupérer les clés**
- **Client Key** → `TIKTOK_CLIENT_ID`
- **Client Secret** → `TIKTOK_CLIENT_SECRET`

## 🔧 **Configuration dans l'application**

### Variables d'environnement
```env
TIKTOK_CLIENT_ID=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_REDIRECT_URI=https://your-domain.com/api/auth/tiktok/callback
```

### Test de connexion
1. Aller sur `/dashboard/accounts`
2. Cliquer sur "Connecter TikTok"
3. Autoriser l'application
4. Vérifier que le compte apparaît dans la liste

## 🚨 **Limitations TikTok Business API**

### Quotas
- **Upload** : 10 vidéos/heure par utilisateur
- **Publication** : 10 vidéos/heure par utilisateur
- **Requêtes API** : 1000/heure par application

### Restrictions
- Vidéos max **500MB**
- Formats supportés : **MP4, MOV, AVI**
- Durée max : **10 minutes**
- Résolution recommandée : **720p ou 1080p**

## 🔍 **Dépannage**

### Erreur "Invalid client"
- Vérifier que `TIKTOK_CLIENT_ID` est correct
- S'assurer que l'application est approuvée

### Erreur "Invalid redirect URI"
- Vérifier que l'URL de redirection correspond exactement
- S'assurer que le domaine est autorisé

### Erreur "Insufficient permissions"
- Vérifier que les permissions sont activées
- S'assurer que le compte est Business

## 📞 **Support TikTok**

- **Documentation** : [developers.tiktok.com/doc](https://developers.tiktok.com/doc)
- **Support** : Via le Developer Portal
- **Communauté** : Discord TikTok Developers

---

🎯 **Une fois configuré, vous pourrez connecter vos comptes TikTok et publier automatiquement !**
