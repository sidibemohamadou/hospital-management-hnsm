@echo off
echo 🏥 Deployment du Systeme de Gestion Hospitaliere HNSM
echo ==================================================

REM Verifier Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installe. Veuillez installer Node.js 18+ d'abord.
    pause
    exit /b 1
)

echo ✅ Node.js detecte
node -v

REM Installer les dependances
echo 📦 Installation des dependances...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dependances
    pause
    exit /b 1
)

REM Construire l'application
echo 🔨 Construction de l'application...
call npm run build

REM Initialiser les donnees de test
echo 🗄️ Initialisation des donnees de test...
call npm run seed

REM Creer les dossiers necessaires
if not exist logs mkdir logs
if not exist uploads mkdir uploads

REM Creer le fichier .env s'il n'existe pas
if not exist .env (
    echo 🔧 Creation du fichier de configuration...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo # Base de donnees optionnelle
        echo # DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db
    ) > .env
    echo ✅ Fichier .env cree
)

REM Demarrer l'application
echo 🚀 Demarrage de l'application...
call npm start

echo.
echo 🎉 Deployment termine avec succes!
echo 🌐 Accedez a l'application sur: http://localhost:5000
echo.
echo 👤 Comptes de test:
echo    Admin:   admin     / password
echo    Medecin: dr.santos / password
echo.
echo 📋 Commandes utiles:
echo    npm run logs     - Voir les logs
echo    npm run stop     - Arreter l'application
echo    npm run restart  - Redemarrer
echo    npm run reset    - Reinitialiser les donnees
pause