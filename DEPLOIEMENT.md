# Guide de Déploiement - Système de Gestion Hospitalière HNSM

Ce guide vous accompagne étape par étape pour déployer votre application sur GitHub et sur votre serveur.

## 📋 Prérequis

- Git installé sur votre machine
- Compte GitHub
- Serveur Linux (Ubuntu/Debian recommandé)
- Node.js 18+ sur votre serveur

## 🚀 Étapes de Déploiement

### 1. Publier sur GitHub

#### A. Créer un repository GitHub
1. Allez sur [GitHub.com](https://github.com) et connectez-vous
2. Cliquez sur le bouton vert "New" pour créer un nouveau repository
3. Nommez votre repository : `hospital-management-hnsm`
4. Laissez-le **public** pour faciliter le déploiement
5. Ne cochez PAS "Initialize with README" (on a déjà un README)
6. Cliquez "Create repository"

#### B. Préparer votre projet local
```bash
# Dans votre terminal, dans le dossier du projet :
git init
git add .
git commit -m "🏥 Initial commit - Hospital Management System HNSM"
```

#### C. Connecter et pousser vers GitHub
```bash
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/hospital-management-hnsm.git
git branch -M main
git push -u origin main
```

### 2. Déploiement sur Votre Serveur

#### Option A: Déploiement Automatique (Recommandé)
```bash
# Sur votre serveur, téléchargez le script de déploiement
wget https://raw.githubusercontent.com/VOTRE-USERNAME/hospital-management-hnsm/main/deploy-server.sh

# Rendez-le exécutable et lancez-le
chmod +x deploy-server.sh
sudo ./deploy-server.sh
```

#### Option B: Déploiement Manuel

##### 1. Cloner le projet sur votre serveur
```bash
# Connectez-vous à votre serveur via SSH
ssh votre-utilisateur@votre-serveur-ip

# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/hospital-management-hnsm.git
cd hospital-management-hnsm
```

##### 2. Installation des dépendances système
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y curl git nginx

# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

##### 3. Installation de l'application
```bash
# Installer les dépendances
npm install

# Construire l'application
npm run build

# Initialiser les données de test
node scripts/seed-data.js
```

##### 4. Configuration de PM2
```bash
# Démarrer l'application avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer automatiquement
pm2 startup
# Suivez les instructions affichées
```

##### 5. Configuration de Nginx (Proxy inverse)
```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/hospital-management

# Copiez cette configuration :
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com;  # Remplacez par votre domaine ou _

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/hospital-management /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Tester et redémarrer Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Configuration du Pare-feu
```bash
# Autoriser le trafic web
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## 🔧 Configuration avec Base de Données PostgreSQL (Optionnel)

Si vous voulez utiliser PostgreSQL au lieu de la base de données en mémoire :

### 1. Installer PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```

### 2. Configurer la base de données
```bash
sudo -u postgres psql

-- Dans PostgreSQL :
CREATE DATABASE hospital_db;
CREATE USER hospital_user WITH ENCRYPTED PASSWORD 'votre-mot-de-passe-securise';
GRANT ALL PRIVILEGES ON DATABASE hospital_db TO hospital_user;
\q
```

### 3. Configurer l'application
```bash
# Créer/modifier le fichier .env
nano .env

# Ajouter :
DATABASE_URL=postgresql://hospital_user:votre-mot-de-passe-securise@localhost:5432/hospital_db
```

### 4. Redémarrer l'application
```bash
pm2 restart all
```

## 🎯 Vérification du Déploiement

### 1. Vérifier l'état des services
```bash
# État de l'application
pm2 list

# État de Nginx
sudo systemctl status nginx

# Logs de l'application
pm2 logs
```

### 2. Test de l'application
- Ouvrez votre navigateur sur `http://votre-serveur-ip` ou `http://votre-domaine.com`
- Connectez-vous avec les comptes de test :
  - Admin: `admin` / `password`
  - Médecin: `dr.santos` / `password`

## 🛠️ Maintenance

### Mettre à jour l'application
```bash
# Sur votre serveur
cd hospital-management-hnsm
git pull origin main
npm install
npm run build
pm2 restart all
```

### Sauvegardes
```bash
# Créer une sauvegarde
pm2 save
sudo systemctl backup nginx

# Les données en mémoire sont automatiquement réinitialisées au redémarrage
```

### Commandes utiles
```bash
pm2 list              # Voir les processus
pm2 logs              # Voir les logs
pm2 restart all       # Redémarrer l'application
pm2 stop all          # Arrêter l'application
sudo systemctl restart nginx  # Redémarrer Nginx
```

## 🆘 Résolution de Problèmes

### L'application ne démarre pas
```bash
# Vérifier les logs
pm2 logs

# Vérifier la configuration
cat .env
```

### Erreur 502 Bad Gateway
```bash
# Vérifier que l'application tourne
pm2 list

# Vérifier la configuration Nginx
sudo nginx -t

# Redémarrer les services
pm2 restart all
sudo systemctl restart nginx
```

### Port 5000 déjà utilisé
```bash
# Voir ce qui utilise le port
sudo netstat -tulpn | grep 5000

# Changer le port dans .env
echo "PORT=3000" >> .env
pm2 restart all
```

## 🎉 Félicitations !

Votre système de gestion hospitalière HNSM est maintenant déployé et accessible !

### Accès
- **URL**: http://votre-serveur-ip ou http://votre-domaine.com
- **Admin**: admin / password
- **Médecin**: dr.santos / password

### Support
Pour toute question, consultez les logs avec `pm2 logs` ou redémarrez l'application avec `pm2 restart all`.