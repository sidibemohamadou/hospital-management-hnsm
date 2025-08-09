# Mise à Jour Production avec PostgreSQL

## Étapes pour mettre à jour votre serveur de production

### Option 1: Nouveau déploiement complet avec PostgreSQL

1. **Connectez-vous à votre serveur:**
   ```bash
   ssh root@82.29.174.38
   ```

2. **Téléchargez et exécutez le nouveau script:**
   ```bash
   wget https://raw.githubusercontent.com/sidibemohamadou/hospital-management-hnsm/main/deploy-server-centos-postgresql.sh
   chmod +x deploy-server-centos-postgresql.sh
   sudo ./deploy-server-centos-postgresql.sh
   ```

### Option 2: Mise à jour manuelle de l'application existante

1. **Connectez-vous à votre serveur:**
   ```bash
   ssh root@82.29.174.38
   ```

2. **Arrêter l'application actuelle:**
   ```bash
   sudo -u nginx pm2 stop hospital-management
   ```

3. **Installer PostgreSQL:**
   ```bash
   dnf install -y postgresql postgresql-server postgresql-contrib
   postgresql-setup --initdb
   systemctl start postgresql
   systemctl enable postgresql
   ```

4. **Configurer la base de données:**
   ```bash
   sudo -u postgres psql
   ```
   
   Dans PostgreSQL:
   ```sql
   CREATE USER hospital_user WITH PASSWORD 'hospital_secure_password_2024';
   CREATE DATABASE hospital_management OWNER hospital_user;
   GRANT ALL PRIVILEGES ON DATABASE hospital_management TO hospital_user;
   \c hospital_management
   GRANT ALL ON SCHEMA public TO hospital_user;
   \q
   ```

5. **Mettre à jour le code de l'application:**
   ```bash
   cd /var/www/hospital-management
   git pull origin main
   sudo -u nginx npm install
   sudo -u nginx npm run build
   ```

6. **Configurer les variables d'environnement:**
   ```bash
   cat > .env << EOF
   NODE_ENV=production
   PORT=5000
   SESSION_SECRET=hnsm-hospital-secret-key-2024
   DATABASE_URL=postgresql://hospital_user:hospital_secure_password_2024@localhost:5432/hospital_management
   PGHOST=localhost
   PGPORT=5432
   PGUSER=hospital_user
   PGPASSWORD=hospital_secure_password_2024
   PGDATABASE=hospital_management
   APP_NAME="Hospital Management HNSM"
   HOSPITAL_NAME="Hôpital National Simão Mendes"
   HOSPITAL_LOCATION="Bissau, Guinée-Bissau"
   EOF
   ```

7. **Créer les tables de la base de données:**
   ```bash
   sudo -u nginx npm run db:push
   ```

8. **Ajouter les utilisateurs par défaut:**
   ```bash
   sudo -u nginx node -e "
   const { Pool } = require('pg');
   const pool = new Pool({
     connectionString: 'postgresql://hospital_user:hospital_secure_password_2024@localhost:5432/hospital_management'
   });

   async function seedData() {
     try {
       await pool.query(\`
         INSERT INTO users (username, password, first_name, last_name, email, role, department, phone, is_active) 
         VALUES 
         ('admin', '\\\$2a\\\$10\\\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur', 'Système', 'admin@hnsm.gw', 'admin', 'Administration', '+245 320 1000', true),
         ('dr.santos', '\\\$2a\\\$10\\\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria', 'Santos', 'maria.santos@hnsm.gw', 'doctor', 'Cardiologie', '+245 320 1001', true),
         ('infermeiro.silva', '\\\$2a\\\$10\\\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'João', 'Silva', 'joao.silva@hnsm.gw', 'nurse', 'Urgences', '+245 320 1002', true),
         ('sec.mendes', '\\\$2a\\\$10\\\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'Mendes', 'ana.mendes@hnsm.gw', 'secretary', 'Accueil', '+245 320 1003', true)
         ON CONFLICT (username) DO NOTHING
       \`);
       console.log('✅ Utilisateurs créés');
     } catch (error) {
       console.log('❌ Erreur:', error.message);
     } finally {
       await pool.end();
     }
   }
   seedData();
   "
   ```

9. **Redémarrer l'application:**
   ```bash
   sudo -u nginx pm2 restart hospital-management
   ```

## Vérifications après mise à jour

1. **Vérifier le statut de l'application:**
   ```bash
   sudo -u nginx pm2 status
   sudo -u nginx pm2 logs
   ```

2. **Vérifier PostgreSQL:**
   ```bash
   systemctl status postgresql
   ```

3. **Tester l'application:**
   - Accéder à http://82.29.174.38
   - Se connecter avec: admin / password
   - Essayer d'ajouter un patient
   - Vérifier que les données sont sauvegardées

## Identifiants par défaut

- **admin** / **password** (Administrateur)
- **dr.santos** / **password** (Médecin)  
- **infermeiro.silva** / **password** (Infirmier)
- **sec.mendes** / **password** (Secrétaire)

**Important:** Changez ces mots de passe après la première connexion !

## En cas de problème

1. **Vérifier les logs:**
   ```bash
   sudo -u nginx pm2 logs hospital-management
   journalctl -u postgresql
   journalctl -u nginx
   ```

2. **Redémarrer les services:**
   ```bash
   systemctl restart postgresql
   systemctl restart nginx
   sudo -u nginx pm2 restart hospital-management
   ```