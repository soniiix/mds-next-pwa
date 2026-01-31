# MDS Next PWA

Ce projet et une Progressive Web Application (PWA) développée avec **Next.js 15**, qui a pour but de permettre une expérience de chat en temps réel avec des fonctionnalités de galerie photo et de gestion de rooms.

## 🌟 Fonctionnalités Principales

-   **Progressive Web App (PWA)** : Installable sur mobile et desktop, fonctionne hors ligne (selon config), mode standalone.
-   **Chat en Temps Réel** : Communication instantanée via WebSockets (Socket.io Client).
-   **Système de Rooms** : Gestion de salles et pseudos pour les discussions (Frontend).
-   **Galerie Photo** : Interface dédiée pour la gestion ou la visualisation de médias.
-   **Design Moderne** : Interface utilisateur soignée utilisant **Tailwind CSS v4** et les **Phosphor Icons**.
-   **Qualité de Code** : Typage strict avec TypeScript, formatage Prettier.
-   **Tests Complets** : Tests unitaires avec Vitest, tests E2E avec Playwright.

## 🛠 Stack Technique

-   **Framework** : [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
-   **UI Library** : [React 19](https://react.dev/)
-   **Styling** : [Tailwind CSS 4](https://tailwindcss.com/) (PostCSS)
-   **Icônes** : [@phosphor-icons/react](https://phosphoricons.com/)
-   **Communication** : [Socket.io Client](https://socket.io/) (Nécessite un serveur Socket.io backend)
-   **Tests Unitaires** : [Vitest](https://vitest.dev/)
-   **Tests E2E** : [Playwright](https://playwright.dev/)
-   **Runtime** : Node.js (Supporte les dernières versions LTS)

## 📂 Structure du Projet

```bash
mds-next-pwa/
├── app/                  # Routes et pages (Next.js App Router)
│   ├── gallery/          # Page Galerie
│   ├── reception/        # Page d'accueil / Réception
│   ├── room/             # Logique des salles de chat
│   ├── layout.tsx        # Layout global (Root)
│   ├── manifest.ts       # Configuration PWA (Manifest)
│   └── page.tsx          # Page racine
├── components/           # Composants Réutilisables
├── __tests__/            # Tests Unitaires (Vitest)
├── e2e/                  # Tests Bout-en-bout (Playwright)
├── public/               # Assets statiques (icons, images)
├── dockerfile            # Configuration Docker pour la production
└── lib/                  # Utilitaires et helpers
```

## 🚀 Guide de Démarrage

### Prérequis

 Assurez-vous d'avoir installé :
-   **Node.js** (v20+ recommandé)
-   **npm** (ou yarn/pnpm)

### Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone <url-du-repo>
cd mds-next-pwa
npm install
```

### Développement

Lancez le serveur de développement avec **Turbopack** pour des rechargements ultra-rapides :

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 📜 Scripts Disponibles

Voici les commandes principales définies dans `package.json` :

| Script | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement local avec Turbopack. |
| `npm run build` | Compile l'application pour la production (optimisations Next.js). |
| `npm run start` | Lance le serveur de production (nécessite un `build` préalable). |
| `npm run test` | Exécute les tests unitaires avec **Vitest**. |
| `npm run test:e2e`| Exécute les tests E2E avec **Playwright**. |

## 🧪 Tests

### Tests Unitaires (Vitest)

Les tests unitaires sont situés dans le dossier `__tests__`. Ils vérifient la logique des composants et des fonctions isolées.

```bash
npm run test
```

### Tests E2E (Playwright)

Les tests End-to-End simulent des parcours utilisateurs complets dans un navigateur réel.

```bash
# Lancer les tests E2E (headless)
npm run test:e2e

# Lancer avec l'interface graphique Playwright pour le débogage
npx playwright test --ui
```

## 🐳 Déploiement avec Docker

Le projet inclut un `dockerfile` optimisé pour Next.js.

1.  **Construire l'image** :
    ```bash
    docker build -t mds-next-pwa .
    ```

2.  **Lancer le conteneur** :
    ```bash
    docker run -p 3000:3000 mds-next-pwa
    ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).
