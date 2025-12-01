# Plataforma Agendei

Solução Integrada de Engenharia de Software para Gestão e Conexão de Serviços Locais.

Este repositório opera sob a arquitetura de **Monorepo**, centralizando o código-fonte da API, da Aplicação Web e do Aplicativo Móvel.

## Módulos do Projeto

- [Web Client](./web/README.md) - Dashboard administrativa e de descoberta.
- [Mobile App](./mobile/README.md) - Aplicativo nativo focado na experiência do usuário final.
- [Backend API](./backend/README.md) - API RESTful modular com regras de negócio e persistência.

## Tech Stack Global

- **Linguagem:** TypeScript (100%)
- **Banco de Dados:** PostgreSQL (Prisma ORM)
- **Estilização:** TailwindCSS / NativeWind
- **Qualidade:** ESLint, Prettier, Husky, Vitest, Playwright
- **Infraestrutura:** Docker, Render, Vercel

## Funcionalidades Chave

### Motor de Disponibilidade (Slots Engine)
Algoritmo matemático no backend que calcula dinamicamente os horários livres baseando-se na duração variável de cada serviço e intervalos de descanso, prevenindo conflitos de agenda (*double-booking*).

### Cadastro Unificado (KYC)
Fluxo de registro que permite perfis híbridos (cliente e prestador), com validação rigorosa de documentos (CPF/CNPJ) e verificação de identidade.

### Busca Geo-localizada
Integração com **BrasilAPI** e **OpenStreetMap** para ordenar e encontrar serviços pela proximidade física do usuário, sem custos de licenciamento.

### Optimistic UI
Interface reativa que antecipa ações do usuário (como favoritar serviços) para proporcionar uma sensação de performance instantânea.

## Como Rodar o Projeto

Este é um monorepo manual. Para executar o ambiente completo, inicie os módulos nesta ordem:

### 1. Backend
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed # Popula com dados de teste
npm run dev
```

### 2. Web Client
```bash
cd web
npm install
npm run dev
```

### 3. Mobile App
```bash
cd mobile
npm install
npx expo start
```

## Gestão

Acompanhe o planejamento e progresso do projeto: Board Agendei no Trello

### Desenvolvido por:
Acácio de Oliveira Lacerda Neto
Trabalho de Conclusão de Curso - Engenharia de Software - 2025