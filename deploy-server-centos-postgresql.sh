#!/bin/bash

echo "🏥 Déploiement Serveur avec PostgreSQL - Système de Gestion Hospitalière HNSM"
echo "========================================================================="
echo "📋 Système détecté: CentOS 10 Stream"
echo ""

# Variables de configuration
APP_NAME="hospital-management"
APP_DIR="/var/www/$APP_NAME"
SERVICE_USER="nginx"
NGINX_CONF_DIR="/etc/nginx/conf.d"
DB_NAME="hospital_management"
DB_USER="hospital_user"
DB_PASSWORD="hospital_secure_password_2024"

# Vérifier les privilèges root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Ce script doit être exécuté en tant que root (sudo)"
    echo "Usage: sudo ./deploy-server-centos-postgresql.sh"
    exit 1
fi

echo "🔄 Mise à jour du système..."
dnf update -y

echo "📦 Installation des dépendances système..."
dnf install -y curl git nginx postgresql postgresql-server postgresql-contrib

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

echo "🗄️ Configuration de PostgreSQL..."
# Initialiser PostgreSQL si nécessaire
if [ ! -f /var/lib/pgsql/data/postgresql.conf ]; then
    echo "🔧 Initialisation de PostgreSQL..."
    postgresql-setup --initdb
fi

# Démarrer et activer PostgreSQL
systemctl start postgresql
systemctl enable postgresql

echo "🗄️ Configuration de la base de données..."
# Créer la base de données et l'utilisateur
sudo -u postgres psql << EOF
-- Créer l'utilisateur
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Créer la base de données
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Donner tous les privilèges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Se connecter à la base et donner les permissions sur le schéma
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Quitter
\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ Base de données PostgreSQL configurée avec succès"
else
    echo "❌ Erreur lors de la configuration de PostgreSQL"
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

echo "⚙️ Configuration des variables d'environnement..."
cat > .env << EOF
NODE_ENV=production
PORT=5000
SESSION_SECRET=hnsm-hospital-secret-key-2024
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
PGHOST=localhost
PGPORT=5432
PGUSER=$DB_USER
PGPASSWORD=$DB_PASSWORD
PGDATABASE=$DB_NAME
APP_NAME="Hospital Management HNSM"
HOSPITAL_NAME="Hôpital National Simão Mendes"
HOSPITAL_LOCATION="Bissau, Guinée-Bissau"
EOF

chown $SERVICE_USER:$SERVICE_USER .env

echo "🗄️ Création des tables de la base de données..."
sudo -u $SERVICE_USER npm run db:push

echo "🌱 Initialisation des données par défaut..."
sudo -u $SERVICE_USER node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME'
});

async function seedData() {
  try {
    // Insérer les utilisateurs par défaut
    await pool.query(\`
      INSERT INTO users (username, password, first_name, last_name, email, role, department, phone, is_active) 
      VALUES 
      ('admin', '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur', 'Système', 'admin@hnsm.gw', 'admin', 'Administration', '+245 320 1000', true),
      ('dr.santos', '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria', 'Santos', 'maria.santos@hnsm.gw', 'doctor', 'Cardiologie', '+245 320 1001', true),
      ('infermeiro.silva', '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'João', 'Silva', 'joao.silva@hnsm.gw', 'nurse', 'Urgences', '+245 320 1002', true),
      ('sec.mendes', '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'Mendes', 'ana.mendes@hnsm.gw', 'secretary', 'Accueil', '+245 320 1003', true)
      ON CONFLICT (username) DO NOTHING
    \`);
    
    console.log('✅ Données par défaut insérées avec succès');
  } catch (error) {
    console.log('❌ Erreur lors de l\\'insertion des données:', error.message);
  } finally {
    await pool.end();
  }
}

seedData();
"

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
    script: 'server/index.js',
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
# Arrêter l'ancienne version s'il y en a une
sudo -u $SERVICE_USER pm2 stop hospital-management 2>/dev/null || true
sudo -u $SERVICE_USER pm2 delete hospital-management 2>/dev/null || true

# Démarrer la nouvelle version
sudo -u $SERVICE_USER pm2 start ecosystem.config.js
sudo -u $SERVICE_USER pm2 save

# Configuration du pare-feu (firewall-cmd pour CentOS)
if command -v firewall-cmd &> /dev/null; then
    echo "🔥 Configuration du pare-feu..."
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-port=5432/tcp  # PostgreSQL
    firewall-cmd --reload
    echo "✅ Pare-feu configuré"
fi

# Configuration SELinux pour PostgreSQL et Nginx
if command -v setsebool &> /dev/null; then
    echo "🔒 Configuration SELinux..."
    setsebool -P httpd_can_network_connect 1
    setsebool -P httpd_can_network_relay 1
    echo "✅ SELinux configuré"
fi

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
echo "=================================="
echo "🌐 Application accessible sur : http://$(hostname -I | awk '{print $1}')"
echo "🗄️ Base de données PostgreSQL configurée"
echo "👤 Utilisateurs par défaut créés:"
echo "   - admin / password (Administrateur)"
echo "   - dr.santos / password (Médecin)"
echo "   - infermeiro.silva / password (Infirmier)"
echo "   - sec.mendes / password (Secrétaire)"
echo ""
echo "📊 Vérifications utiles:"
echo "   - Statut de l'app: sudo -u nginx pm2 status"
echo "   - Logs de l'app: sudo -u nginx pm2 logs"
echo "   - Statut PostgreSQL: systemctl status postgresql"
echo "   - Statut Nginx: systemctl status nginx"
echo ""
echo "⚠️  IMPORTANT: Changez les mots de passe par défaut après la première connexion!"