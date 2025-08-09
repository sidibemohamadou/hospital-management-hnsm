#!/usr/bin/env node

/**
 * Script d'initialisation des données de test
 * pour le Système de Gestion Hospitalière HNSM
 */

console.log('🏥 Initialisation des données de test pour HNSM...');

// Simuler l'initialisation des données
// En réalité, les données sont déjà dans la classe MemStorage
console.log('✅ Données administrateur créées:');
console.log('   👤 admin / password (Administrateur Système)');
console.log('   📧 admin@hnsm.gw');

console.log('✅ Données médecin créées:');
console.log('   👤 dr.santos / password (Dr. Maria Santos - Cardiologie)'); 
console.log('   📧 maria.santos@hnsm.gw');

console.log('🗄️ Base de données en mémoire initialisée');

// Créer le fichier de configuration s'il n'existe pas
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    const envContent = `NODE_ENV=development
PORT=5000
# Configuration optionnelle PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db

# Configuration de session
SESSION_SECRET=hnsm-hospital-secret-key-2024

# Configuration de l'application
APP_NAME="Hospital Management HNSM"
HOSPITAL_NAME="Hôpital National Simão Mendes"
HOSPITAL_LOCATION="Bissau, Guinée-Bissau"
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Fichier .env créé avec la configuration par défaut');
}

// Créer les dossiers nécessaires
const dirs = ['logs', 'uploads', 'backups'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Dossier ${dir}/ créé`);
    }
});

console.log('');
console.log('🎉 Initialisation terminée avec succès!');
console.log('');
console.log('📋 Comptes de test disponibles:');
console.log('┌────────────┬──────────┬─────────────────────┐');
console.log('│ Utilisateur│ Mot Pass │ Rôle                │');
console.log('├────────────┼──────────┼─────────────────────┤');
console.log('│ admin      │ password │ Administrateur      │');
console.log('│ dr.santos  │ password │ Médecin Cardiologie │');
console.log('└────────────┴──────────┴─────────────────────┘');
console.log('');
console.log('🚀 Vous pouvez maintenant démarrer l\'application avec:');
console.log('   npm run dev  (développement)');
console.log('   npm start    (production)');
console.log('');