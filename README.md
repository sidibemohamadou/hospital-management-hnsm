# Système de Gestion Hospitalière - Hôpital National Simão Mendes

Un système complet de gestion hospitalière développé pour l'Hôpital National Simão Mendes en Guinée-Bissau.

## 🏥 Fonctionnalités

- **Gestion des Patients** : Enregistrement, dossiers médicaux, historique
- **Rendez-vous** : Planification et suivi des consultations  
- **Personnel** : Gestion du personnel médical et administratif
- **Inventaire** : Suivi des stocks de médicaments et fournitures
- **Laboratoire** : Gestion des analyses et tests médicaux
- **Finances** : Suivi des paiements et transactions
- **Tableau de bord** : Métriques et alertes en temps réel

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+ 
- PostgreSQL (optionnel - utilise une base de données en mémoire par défaut)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-nom-utilisateur/hospital-management-hnsm.git
cd hospital-management-hnsm
```

### 2. Installation automatique
```bash
# Sur Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Sur Windows
deploy.bat
```

### 3. Accès à l'application
- Ouvrez votre navigateur sur `http://localhost:5000`
- **Comptes de test :**
  - Admin : `admin` / `password`
  - Médecin : `dr.santos` / `password`

## 📦 Installation Manuelle

### 1. Installer les dépendances
```bash
npm install
```

### 2. Initialiser avec des données de test
```bash
npm run seed
```

### 3. Lancer l'application
```bash
npm run dev
```

## 🌐 Déploiement sur Serveur

### Option 1: Déploiement Simple (PM2)
```bash
# Installation de PM2
npm install -g pm2

# Démarrer l'application
npm run deploy:production
```

### Option 2: Avec Docker
```bash
# Construire l'image
docker build -t hospital-management .

# Lancer le conteneur
docker run -p 5000:5000 hospital-management
```

### Option 3: Serveur Linux (Ubuntu/Debian)
```bash
# Copier le script de déploiement sur votre serveur
scp deploy-server.sh user@votre-serveur:/home/user/
scp -r . user@votre-serveur:/home/user/hospital-management/

# Se connecter au serveur et exécuter
ssh user@votre-serveur
cd /home/user/hospital-management
chmod +x deploy-server.sh
./deploy-server.sh
```

## 🔧 Configuration

### Variables d'environnement (optionnel)
Créez un fichier `.env` :
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db
```

### Base de données PostgreSQL (optionnel)
Si vous voulez utiliser PostgreSQL au lieu de la base de données en mémoire :
1. Installez PostgreSQL
2. Créez une base de données `hospital_db`
3. Configurez `DATABASE_URL` dans `.env`
4. Exécutez `npm run migrate`

## 🎯 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Construction pour production
npm run start        # Lancement en production
npm run seed         # Ajouter des données de test
npm run migrate      # Migration base de données (si PostgreSQL)
npm run deploy       # Déploiement automatique
```

## 👥 Comptes par Défaut

| Rôle | Utilisateur | Mot de passe | Accès |
|------|-------------|--------------|--------|
| Administrateur | `admin` | `password` | Tous les modules |
| Médecin | `dr.santos` | `password` | Patients, Rendez-vous, Laboratoire |

## 🆘 Support

Pour obtenir de l'aide :
1. Consultez les logs : `npm run logs`
2. Redémarrez l'application : `npm run restart`
3. Réinitialisez les données : `npm run reset`

## 📜 Licence

MIT License - Libre d'utilisation pour des projets hospitaliers.

---

**Développé pour l'Hôpital National Simão Mendes, Guinée-Bissau** 🇬🇼