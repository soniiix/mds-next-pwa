Ce projet est une Progressive Web App (PWA) moderne construite avec Next.js.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **Langage**: TypeScript
- **Style**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icônes**: Phosphor Icons
- **Temps réel**: Socket.io client
- **Tests**: Vitest

## 🚀 Commencer

### Prérequis

- Node.js (version LTS recommandée)
- npm

### Installation

```bash
npm install
```

### Développement

Lancer le serveur de développement (avec Turbopack) :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

### Build & Production

Construire l'application pour la production :

```bash
npm run build
```

Lancer la version de production :

```bash
npm start
```

### Tests

Lancer les tests unitaires :

```bash
npm run test
```

## 🐳 Docker

Le projet inclut un support Docker. Vous pouvez construire l'image avec le `dockerfile` fourni.
