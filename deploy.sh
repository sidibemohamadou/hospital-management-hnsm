#!/bin/bash

echo "🏥 Déploiement du Système de Gestion Hospitalière HNSM"
echo "=================================================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Construire l'application
echo "🔨 Construction de l'application..."
npm run build

# Créer le fichier de données de test
echo "🗄️ Initialisation des données de test..."
npm run seed

# Créer les dossiers nécessaires
mkdir -p logs
mkdir -p uploads

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "🔧 Création du fichier de configuration..."
    cat > .env << EOF
NODE_ENV=development
PORT=5000
# Base de données optionnelle
# DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db
EOF
    echo "✅ Fichier .env créé"
fi

# Vérifier si PM2 est installé
if command -v pm2 &> /dev/null; then
    echo "🚀 Démarrage avec PM2..."
    pm2 start ecosystem.config.js
    pm2 save
    echo "✅ Application démarrée avec PM2"
else
    echo "🚀 Démarrage de l'application..."
    echo "📝 Pour installer PM2 (gestionnaire de processus), exécutez: npm install -g pm2"
    npm start &
    echo "✅ Application démarrée en arrière-plan"
fi

echo ""
echo "🎉 Déploiement terminé avec succès!"
echo "🌐 Accédez à l'application sur: http://localhost:5000"
echo ""
echo "👤 Comptes de test:"
echo "   Admin:   admin     / password"
echo "   Médecin: dr.santos / password"
echo ""
echo "📋 Commandes utiles:"
echo "   npm run logs     - Voir les logs"
echo "   npm run stop     - Arrêter l'application"
echo "   npm run restart  - Redémarrer"
echo "   npm run reset    - Réinitialiser les données"