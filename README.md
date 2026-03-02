# RegistreDPO — Plateforme MVP

Registre des traitements RGPD (Article 30) avec authentification Google SSO et backend Supabase.

## Stack
- **Frontend** : HTML/CSS/JS vanilla (single file)
- **Backend** : Supabase (PostgreSQL + Auth + Realtime)
- **Auth** : Google OAuth via Supabase
- **Hosting** : Netlify (deploy auto depuis ce repo)

## Setup rapide

### 1. Supabase
1. Créer un projet sur [supabase.com](https://supabase.com)
2. SQL Editor → New Query → exécuter le script dans `index.html` (onglet Configuration)
3. Authentication → Providers → Google → activer avec vos credentials Google OAuth
4. Authentication → URL Configuration → ajouter votre URL Netlify dans Redirect URLs

### 2. Google OAuth
1. [console.cloud.google.com](https://console.cloud.google.com) → Create Project
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID → Web Application
3. Authorized redirect URIs : `https://VOTRE-ID.supabase.co/auth/v1/callback`
4. Copier Client ID et Secret dans Supabase → Authentication → Providers → Google

### 3. Netlify
1. [netlify.com](https://netlify.com) → Add new site → Import from Git
2. Sélectionner ce repo → Deploy
3. Récupérer l'URL Netlify et l'ajouter dans Supabase Redirect URLs

### 4. Configurer l'app
- Ouvrir l'app → cliquer "⚙ Configurer Supabase" → entrer URL et anon key

## Collaboration
Deux personnes peuvent travailler en simultané. Les changements sont synchronisés en temps réel via Supabase Realtime.

Pour modifier le code :
```bash
git clone https://github.com/VOTRE-USERNAME/registre-dpo.git
cd registre-dpo
# modifier index.html
git add . && git commit -m "description" && git push
# Netlify redéploie automatiquement en ~30 secondes
```

## Fonctionnalités MVP
- ✅ Authentification Google SSO
- ✅ Registre des traitements (Article 30 RGPD)
- ✅ Tableau de bord avec statistiques
- ✅ Création / modification / suppression
- ✅ Journal d'audit complet
- ✅ Export CSV
- ✅ Sync temps réel entre utilisateurs
- ✅ Recherche et filtres
