# Agendei Web Client

Dashboard administrativa e de descoberta para a plataforma Agendei.

## Tech Stack

- **Core:** React, Vite, TypeScript
- **Styling:** TailwindCSS, Shadcn/UI
- **State & Data:** React Query, React Hook Form, Zod
- **Integrations:** BrasilAPI, OpenStreetMap

## Funcionalidades Chave

### Optimistic UI
Implementação de feedback visual instantâneo para ações de usuário (ex: favoritar serviços), revertendo o estado apenas em caso de falha na requisição.

### Server State Management
Utilização do **React Query** para gerenciamento de cache, revalidação automática e sincronização de estado com o backend, eliminando a necessidade de stores globais complexas para dados do servidor.

### Integrações
- **BrasilAPI:** Autocompletar e validação de endereços via CEP.
- **OpenStreetMap:** Renderização de mapas e geolocalização para descoberta de serviços.

### Design System
- **Dark Mode:** Suporte nativo a temas claro e escuro.
- **i18n:** Internacionalização preparada para escalabilidade.

## Instalação

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

## Gestão

Acompanhe o progresso do projeto no Trello:
[Board Agendei](https://trello.com/invite/b/6923691dc80ae47b7f0729f8/ATTI39f8a221bb69fd07e5cafddd97ac5004A6DA3F14/agendai)
