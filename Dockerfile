# Dockerfile pour le Système de Gestion Hospitalière HNSM
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Créer les dossiers nécessaires
RUN mkdir -p logs uploads

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Exposer le port
EXPOSE 5000

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV PORT=5000

# Commande de démarrage
CMD ["npm", "start"]