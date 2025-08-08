# 🏥 Instructions Simples pour Déployer votre Hôpital HNSM

**Bonjour ! Je vais vous guider pas à pas pour mettre en ligne votre système de gestion hospitalière.**

## 🎯 Ce que nous allons faire

1. **Publier votre code sur GitHub** (dépôt public gratuit)
2. **Installer sur votre serveur** avec des scripts automatiques
3. **Tester avec des données de démonstration**

## 📁 Fichiers créés pour vous

J'ai préparé tous les fichiers nécessaires :

### Scripts de déploiement
- **`deploy.sh`** → Script automatique pour Linux/Mac
- **`deploy.bat`** → Script automatique pour Windows  
- **`deploy-server.sh`** → Installation automatique sur serveur
- **`scripts/seed-data.js`** → Création des données de test

### Documentation
- **`README.md`** → Description complète du projet
- **`DEPLOIEMENT.md`** → Guide technique détaillé
- **`INSTRUCTIONS-DEPLOIEMENT.md`** → Ce fichier (guide simple)

### Configuration
- **`ecosystem.config.js`** → Configuration PM2 (gestionnaire de processus)
- **`Dockerfile`** → Pour déploiement Docker (optionnel)
- **`docker-compose.yml`** → Orchestration Docker (optionnel)
- **`nginx.conf`** → Configuration serveur web
- **`.gitignore`** → Fichiers à ignorer par Git

## 🚀 Étapes Faciles

### Étape 1: Publier sur GitHub (5 minutes)

1. **Créez un compte GitHub** sur [github.com](https://github.com) (gratuit)

2. **Créez un nouveau dépôt**:
   - Cliquez le bouton vert "New"
   - Nom: `hospital-management-hnsm` 
   - Cochez "Public" (gratuit)
   - **NE cochez PAS** "Initialize with README" 
   - Cliquez "Create repository"

3. **Dans votre terminal**, tapez ces commandes:
   ```bash
   git init
   git add .
   git commit -m "🏥 Initial commit - Hospital Management System HNSM"
   git remote add origin https://github.com/VOTRE-NOM-UTILISATEUR/hospital-management-hnsm.git
   git push -u origin main
   ```
   
   ⚠️ **Important**: Remplacez `VOTRE-NOM-UTILISATEUR` par votre nom d'utilisateur GitHub

### Étape 2: Test Local (2 minutes)

Avant de déployer sur votre serveur, testez localement :

**Sur Linux/Mac:**
```bash
./deploy.sh
```

**Sur Windows:**
```bash
deploy.bat
```

L'application sera accessible sur `http://localhost:5000`

### Étape 3: Déploiement Serveur (10 minutes)

**Option A: Script Automatique (Recommandé)**

*Pour Ubuntu/Debian et CentOS/RHEL:*
```bash
# Sur votre serveur 
wget https://github.com/VOTRE-NOM-UTILISATEUR/hospital-management-hnsm/raw/main/deploy-server.sh
chmod +x deploy-server.sh
sudo ./deploy-server.sh
```

ℹ️ **Note**: Le script détecte automatiquement votre système (Ubuntu/Debian ou CentOS) et utilise les bonnes commandes.

**Option B: Installation Manuelle**
Suivez le guide détaillé dans `DEPLOIEMENT.md`

## 👤 Comptes de Test

Une fois déployé, vous pouvez vous connecter avec :

| Utilisateur | Mot de passe | Rôle |
|-------------|--------------|------|
| `admin` | `password` | Administrateur (tous les droits) |
| `dr.santos` | `password` | Médecin Cardiologue |

## 🔧 Que fait chaque script ?

### `deploy.sh` (Local)
- Installe les dépendances Node.js
- Construit l'application  
- Initialise les données de test
- Lance l'application avec PM2

### `deploy-server.sh` (Serveur)
- Met à jour le système
- Installe Node.js, Nginx, PM2
- Configure le serveur web
- Démarre automatiquement l'application
- Configure le pare-feu

### `scripts/seed-data.js`
- Crée les comptes utilisateurs de test
- Génère les dossiers nécessaires
- Configure les variables d'environnement

## ⚙️ Personnalisation

### Changer les mots de passe
Éditez le fichier `server/storage.ts` lignes 99 et 116 pour changer les mots de passe par défaut.

### Configurer PostgreSQL (Optionnel)
Si vous voulez une vraie base de données au lieu de la mémoire :
1. Créez un fichier `.env`
2. Ajoutez : `DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db`

### Personnaliser l'hôpital
Éditez les constantes dans `server/storage.ts` pour changer :
- Nom de l'hôpital
- Adresse
- Informations par défaut

## 🆘 Problèmes Fréquents

### "Node.js not found"
**Sur Ubuntu/Debian:**
Installez Node.js 18+ depuis [nodejs.org](https://nodejs.org)

**Sur CentOS/RHEL:**
```bash
sudo dnf module install -y nodejs:18/common
```

### "Permission denied"
Sur Linux/Mac, ajoutez `sudo` avant les commandes

### "Port 5000 already in use"  
Changez le port dans le fichier `.env` : `PORT=3000`

### Problèmes CentOS spécifiques
**SELinux bloque l'application:**
```bash
# Autoriser les connexions réseau pour Nginx
sudo setsebool -P httpd_can_network_connect 1
```

### L'application ne s'affiche pas
**Sur Ubuntu/Debian:**
```bash
sudo ufw allow 80
```

**Sur CentOS/RHEL:**
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

## ✅ Vérification Finale

Après déploiement, vérifiez que tout fonctionne :

1. **Ouvrez votre navigateur** sur `http://votre-serveur-ip`
2. **Connectez-vous** avec `admin` / `password`  
3. **Testez les modules** : Patients, Rendez-vous, Personnel, etc.
4. **Vérifiez le tableau de bord** affiche les statistiques

## 📞 Support

Si vous avez des problèmes :

1. **Consultez les logs** : `pm2 logs` (sur le serveur)
2. **Redémarrez l'application** : `pm2 restart all`  
3. **Vérifiez le statut** : `pm2 list`

## 🎉 Félicitations !

Votre système de gestion hospitalière pour l'Hôpital National Simão Mendes est maintenant en ligne et prêt à être utilisé !

---

**📧 Besoin d'aide ?** Consultez le fichier `DEPLOIEMENT.md` pour plus de détails techniques.