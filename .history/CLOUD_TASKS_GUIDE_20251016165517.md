# ⏰ Guide Cloud Tasks - TikTok Crossposter

## 🎯 **Oui, vous pouvez créer la queue Cloud Tasks avec Firebase !**

### **Méthodes disponibles :**

## 🚀 **Méthode 1 : Cloud Functions (Recommandée)**

### **Fonctions disponibles :**
- `createTaskQueue` - Créer la queue Cloud Tasks
- `schedulePublishTask` - Planifier une publication
- `listTasks` - Lister les tâches en attente
- `cancelTask` - Annuler une tâche

### **Déploiement :**
```bash
# Déployer les fonctions
./scripts/deploy-cloud-tasks.sh

# Ou manuellement
cd functions
yarn install
yarn build
cd ..
firebase deploy --only functions
```

### **Utilisation depuis l'API :**
```javascript
// Créer la queue
const response = await fetch('/api/cloud-tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'createQueue' })
});

// Planifier une publication
const response = await fetch('/api/cloud-tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'scheduleTask',
    scheduleId: 'schedule123',
    videoId: 'video123',
    accountId: 'account123',
    userId: 'user123',
    scheduledAt: '2024-01-20T14:30:00Z'
  })
});
```

## 🔧 **Méthode 2 : Firebase CLI**

```bash
# Initialiser Firebase
firebase init functions

# Déployer les fonctions
firebase deploy --only functions

# Appeler la fonction pour créer la queue
firebase functions:shell
# Dans le shell :
# createTaskQueue()
```

## 🌐 **Méthode 3 : Interface Firebase Console**

1. Aller dans **Firebase Console** → **Functions**
2. Cliquer sur **createTaskQueue**
3. Tester la fonction
4. La queue sera créée automatiquement

## 📋 **Configuration automatique**

### **Script de déploiement complet :**
```bash
# Exécuter le script complet
./scripts/deploy-cloud-tasks.sh
```

Ce script va :
1. ✅ Installer les dépendances
2. ✅ Builder les fonctions
3. ✅ Déployer sur Firebase
4. ✅ Créer la queue Cloud Tasks
5. ✅ Vérifier le déploiement

## 🔍 **Vérification**

### **Dans Firebase Console :**
- [ ] **Functions** : `createTaskQueue`, `schedulePublishTask`, etc.
- [ ] **Logs** : Vérifier les logs de déploiement

### **Dans Google Cloud Console :**
- [ ] **Cloud Tasks** : Queue `publish-queue` créée
- [ ] **IAM** : Permissions configurées

### **Test fonctionnel :**
```bash
# Tester la création de queue
curl -X POST https://us-central1-lumapost-38e61.cloudfunctions.net/createTaskQueue \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🚨 **Avantages de cette approche**

### ✅ **Simplicité**
- Pas besoin de gcloud CLI
- Tout géré via Firebase
- Interface unifiée

### ✅ **Sécurité**
- Authentification Firebase intégrée
- Règles de sécurité automatiques
- Gestion des permissions simplifiée

### ✅ **Monitoring**
- Logs centralisés dans Firebase Console
- Métriques intégrées
- Alertes automatiques

## 🎯 **Utilisation dans l'application**

### **Créer une planification :**
```javascript
// Dans votre composant React
const scheduleVideo = async (videoData) => {
  const response = await fetch('/api/cloud-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'scheduleTask',
      ...videoData
    })
  });
  
  const result = await response.json();
  console.log('Tâche planifiée:', result.taskName);
};
```

### **Annuler une planification :**
```javascript
const cancelSchedule = async (taskName) => {
  const response = await fetch('/api/cloud-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'cancelTask',
      taskName
    })
  });
  
  const result = await response.json();
  console.log('Tâche annulée:', result.message);
};
```

## 🏆 **Résultat**

**Avec cette approche, vous avez :**
- ✅ **Queue Cloud Tasks** créée automatiquement
- ✅ **Fonctions de gestion** déployées
- ✅ **API REST** pour l'interface
- ✅ **Monitoring** intégré
- ✅ **Sécurité** Firebase native

**Votre système de planification est 100% opérationnel !** 🚀
