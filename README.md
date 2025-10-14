# Projetheque - Gestion de Projets Étudiants

Bienvenue dans le projet Projetheque, une application de bibliothèque numérique pour consulter, soumettre et évaluer les projets académiques des étudiants développé avec un backend Laravel, un frontend React et une base de donnée MySQL.

## Table des Matières

1.  [Prérequis](#1-prérequis)
2.  [Installation du Backend (Laravel)](#2-installation-du-backend-laravel)
    *   [Dépendances du Backend](#dépendances-du-backend)
    *   [Configuration du fichier .env](#configuration-du-fichier-env)
3.  [Création d'un Compte Administrateur](#3-création-dun-compte-administrateur)
4.  [Installation du Frontend (React)](#4-installation-du-frontend-react)
    *   [Dépendances du Frontend](#dépendances-du-frontend)
    *   [Configuration de l'URL de l'API](#configuration-de-lurl-de-lapi)
5.  [Accès à l'Application](#5-accès-à-lapplication)

---

## 1. Prérequis

Assurez-vous que les logiciels suivants sont installés sur votre système avec les versions recommandées :

*   **PHP**: Version `^8.2` (minimum 8.2).
    *   Vérifiez avec : `php -v`
*   **Composer**: Gestionnaire de dépendances PHP.
    *   Vérifiez avec : `composer -v`
*   **Node.js**: Version `^14.0.0` (minimum 14.x).
    *   Vérifiez avec : `node -v`
*   **npm**: Gestionnaire de paquets Node.js (généralement inclus avec Node.js).
    *   Vérifiez avec : `npm -v`
*   **Une base de données**:
    *   **MySQL(qu'on a utilisé) ou PostgreSQL si vous préférerer**

## 2. Installation du Backend (Laravel)

Le backend est développé avec le framework PHP Laravel.

### Dépendances du Backend

Les principales dépendances PHP sont :
*   `laravel/framework: ^12.0`
*   `laravel/sanctum: ^4.2`
*   `laravel/tinker: ^2.10.1`

### Étapes d'installation

1.  **Naviguez vers le dossier du backend :**
    ```bash
    cd backend
    ```

2.  **Installez les dépendances PHP :**
    ```bash
    composer install
    ```

3.  **Configurez le fichier d'environnement :**
    Copiez le fichier d'exemple `.env.example` pour créer votre fichier `.env` et générez une clé d'application unique.
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Configuration du fichier `.env` :**
    Ouvrez le fichier `.env` (situé dans le dossier `backend`) avec votre éditeur de texte.

    *   **`APP_URL` :** Assurez-vous que cette variable pointe vers l'URL de votre serveur backend.
        ```dotenv
        APP_URL=http://127.0.0.1:8000
        ```

    *   **Configuration de la base de données :**
        *   **Pour SQLite (recommandé) :**
            Assurez-vous que la ligne `DB_CONNECTION=sqlite` est présente. Vous n'avez pas besoin de configurer `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` pour SQLite.
            ```dotenv
            DB_CONNECTION=sqlite
            # DB_HOST=127.0.0.1
            # DB_PORT=3306
            # DB_DATABASE=laravel
            # DB_USERNAME=root
            # DB_PASSWORD=
            ```
            Le fichier `database/database.sqlite` sera créé automatiquement lors de la première migration.

        *   **Pour MySQL/PostgreSQL :**
            Configurez les informations de connexion appropriées. **C'est ici que vous devrez adapter le `DB_PASSWORD`** (et potentiellement `DB_USERNAME` et `DB_DATABASE`) si vous utilisez une base de données différente de SQLite.
            ```dotenv
            DB_CONNECTION=mysql # ou pgsql
            DB_HOST=127.0.0.1
            DB_PORT=3306 # ou 5432 pour PostgreSQL
            DB_DATABASE=projetheque_db # Nom de votre base de données
            DB_USERNAME=root # Votre nom d'utilisateur
            DB_PASSWORD=votre_mot_de_passe # <--- Adaptez ceci
            ```

5.  **Exécutez les migrations de la base de données :**
    Ceci créera toutes les tables nécessaires dans votre base de données.
    ```bash
    php artisan migrate
    ```

6.  **Lancez le serveur de développement Laravel :**
    ```bash
    php artisan serve
    ```
    Le backend sera accessible à l'adresse `http://127.0.0.1:8000`. Laissez ce terminal ouvert car le serveur doit rester en cours d'exécution.

## 3. Création d'un Compte Administrateur

Nous allons utiliser la console interactive `php artisan tinker` de Laravel pour créer un utilisateur avec le rôle `administrateur`.

1.  **Ouvrez un nouveau terminal** et naviguez vers le dossier `backend` :
    ```bash
    cd backend
    ```

2.  **Lancez Tinker :**
    ```bash
    php artisan tinker
    ```

3.  **Créez un utilisateur administrateur :**
    Dans la console Tinker, exécutez les commandes PHP suivantes. Remplacez `Admin User`, `admin@example.com` et `password` par les informations de votre choix.

    ```php
    $user = App\Models\User::create([
        'nom' => 'Admin User',
        'email' => 'admin@example.com',
        'password' => bcrypt('password'), // Utilisez un mot de passe fort
        'role' => 'administrateur', // Définir le rôle comme administrateur
    ]);
    echo "Utilisateur administrateur créé : " . $user->email;
    ```
    *Note :* Le champ `nom` correspond à la colonne `nom` dans votre table `utilisateurs`.

4.  **Quittez Tinker :**
    ```bash
    exit
    ```

## 4. Installation du Frontend (React)

Le frontend est une application React.

### Dépendances du Frontend

Les principales dépendances Node.js sont :
*   `react: ^19.2.0`
*   `react-dom: ^19.2.0`
*   `react-router-dom: ^7.9.4`
*   `axios: ^1.12.2`
*   `@mui/material: ^7.3.4` (Material-UI)

### Étapes d'installation

1.  **Ouvrez un nouveau terminal** et naviguez vers le dossier du frontend :
    ```bash
    cd frontend
    ```

2.  **Installez les dépendances Node.js :**
    ```bash
    npm install
    ```

3.  **Configuration de l'URL de l'API :**
    Le frontend doit savoir où trouver le backend. Par défaut, il est probable qu'il tente de se connecter à `http://localhost:8000` ou `http://127.0.0.1:8000`.

    *   **Vérifiez `frontend/src/services/projetService.js`** (ou un fichier similaire) pour voir comment l'URL de base de l'API est définie.
    *   Si nécessaire, vous pouvez créer un fichier `.env.local` dans le dossier `frontend` et y ajouter la variable d'environnement pour l'URL de l'API, par exemple :
        ```dotenv
        REACT_APP_API_URL=http://127.0.0.1:8000/api
        ```
        *N'oubliez pas de redémarrer le serveur de développement frontend après avoir créé ou modifié ce fichier.*

4.  **Lancez le serveur de développement React :**
    ```bash
    npm start
    ```
    Le frontend sera accessible à l'adresse `http://localhost:3000`. Laissez ce terminal ouvert car le serveur doit rester en cours d'exécution.

## 5. Accès à l'Application

Une fois que les serveurs backend et frontend sont tous deux en cours d'exécution :

*   **Accédez à l'application frontend** dans votre navigateur : `http://localhost:3000`
*   Vous devriez pouvoir vous connecter avec l'utilisateur administrateur que vous avez créé (`admin@example.com` avec le mot de passe choisi).

---
