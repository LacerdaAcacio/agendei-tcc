# Plataforma Agendei - TCC

Repositório monorepo contendo todo o código fonte da solução Agendei.

## Estrutura do Projeto

Este repositório está dividido em três módulos principais:

* [WEB](./web): Frontend Web (React.js + Vite + Tailwind). Painel para clientes e prestadores.
* [MOBILE](./mobile): Aplicativo Mobile (React Native + Expo). Focado na experiência do usuário final.
* [BACKEND](./backend): API RESTful (Node.js + Express + Prisma). Regras de negócio e banco de dados.

## Como Rodar

### Backend
```bash
cd backend
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

### Web
```bash
cd web
npm install
npm run dev
```

