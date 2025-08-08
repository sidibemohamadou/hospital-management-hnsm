#!/bin/bash

echo "🏥 Déploiement Serveur - Système de Gestion Hospitalière HNSM"
echo "==============================================================="
echo "📋 Système détecté: CentOS 10 Stream"
echo ""

# Variables de configuration
APP_NAME="hospital-management"
APP_DIR="/var/www/$APP_NAME"
SERVICE_USER="nginx"
NGINX_CONF_DIR="/etc/nginx/conf.d"

# Vérifier les privilèges root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Ce script doit être exécuté en tant que root (sudo)"
    echo "Usage: sudo ./deploy-server-centos-fixed.sh"
    exit 1
fi

echo "🔄 Mise à jour du système..."
dnf update -y

echo "📦 Installation des dépendances système..."
dnf install -y curl git nginx

# Installer Node.js 18+
if ! command -v node &> /dev/null; then
    echo "📦 Installation de Node.js..."
    dnf module install -y nodejs:18/common
fi

echo "✅ Node.js $(node -v) installé"

# Installer PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installation de PM2..."
    npm install -g pm2
fi

echo "📁 Création du répertoire d'application..."
mkdir -p $APP_DIR

echo "📂 Clone du projet depuis GitHub..."
cd /tmp
rm -rf hospital-management-hnsm
git clone https://github.com/sidibemohamadou/hospital-management-hnsm.git
cp -r hospital-management-hnsm/* $APP_DIR/
chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR

cd $APP_DIR

echo "📦 Installation des dépendances de l'application..."
sudo -u $SERVICE_USER npm install

echo "🏗️ Build de l'application pour la production..."
sudo -u $SERVICE_USER npm run build

echo "📂 Configuration des fichiers statiques..."
# Copier les fichiers buildés vers le dossier attendu par le serveur
sudo -u $SERVICE_USER mkdir -p server/public
sudo -u $SERVICE_USER cp -r dist/public/* server/public/

echo "🗄️ Initialisation des données..."
sudo -u $SERVICE_USER node scripts/seed-data.js

echo "⚙️ Configuration des variables d'environnement..."
cat > .env << EOF
NODE_ENV=production
PORT=5000
SESSION_SECRET=hnsm-hospital-secret-key-2024
APP_NAME="Hospital Management HNSM"
HOSPITAL_NAME="Hôpital National Simão Mendes"
HOSPITAL_LOCATION="Bissau, Guinée-Bissau"
EOF

chown $SERVICE_USER:$SERVICE_USER .env

echo "🔧 Configuration de Nginx..."
cat > $NGINX_CONF_DIR/$APP_NAME.conf << 'EOF'
server {
    listen 80;
    server_name _;

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

    # Servir les fichiers statiques directement
    location /assets/ {
        alias /var/www/hospital-management/server/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Supprimer la configuration par défaut
rm -f $NGINX_CONF_DIR/default.conf

# Tester et redémarrer Nginx
nginx -t
if [ $? -eq 0 ]; then
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ Nginx configuré et démarré"
else
    echo "❌ Erreur de configuration Nginx"
    exit 1
fi

echo "🚀 Configuration de PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hospital-management',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

chown $SERVICE_USER:$SERVICE_USER ecosystem.config.js

echo "🚀 Démarrage de l'application avec PM2..."
sudo -u $SERVICE_USER pm2 start ecosystem.config.js
sudo -u $SERVICE_USER pm2 save
sudo -u $SERVICE_USER pm2 startup

# Configuration du pare-feu (firewall-cmd pour CentOS)
if command -v firewall-cmd &> /dev/null; then
    echo "🔥 Configuration du pare-feu..."
    systemctl enable --now firewalld
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-service=ssh
    firewall-cmd --reload
    echo "✅ Pare-feu configuré"
fi

# Configuration SELinux pour CentOS
echo "🛡️ Configuration SELinux..."
setsebool -P httpd_can_network_connect 1

echo ""
echo "🎉 Déploiement serveur terminé avec succès!"
echo ""
echo "📊 État des services:"
echo "   Nginx: $(systemctl is-active nginx)"
echo "   Firewall: $(systemctl is-active firewalld)"
echo "   Application: $(sudo -u $SERVICE_USER pm2 list)"
echo ""
echo "🌐 Votre application est accessible sur:"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "👤 Comptes de test:"
echo "   Admin:   admin     / password"
echo "   Médecin: dr.santos / password"
echo ""
echo "🛠️ Commandes de maintenance:"
echo "   sudo -u $SERVICE_USER pm2 list         # État de l'app"
echo "   sudo -u $SERVICE_USER pm2 logs         # Voir les logs"
echo "   sudo -u $SERVICE_USER pm2 restart all  # Redémarrer"
echo "   systemctl status nginx                 # État Nginx"
echo ""
echo "🔍 Si vous avez toujours une erreur 404:"
echo "   sudo -u $SERVICE_USER pm2 logs         # Vérifiez les logs"
echo "   ls -la $APP_DIR/server/public          # Vérifiez les fichiers"