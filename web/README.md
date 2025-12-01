# Agendei Web Client

Interface administrativa e de descoberta para a plataforma Agendei, desenvolvida com foco em performance, acessibilidade e integridade de código.

## Tech Stack

- **Core:** React 18, Vite, TypeScript
- **Estilização:** TailwindCSS, Shadcn/UI (Radix Primitives)
- **Gerenciamento de Estado:** React Query (TanStack), React Hook Form, Zod
- **Qualidade & Testes:** Vitest, Playwright, ESLint, Prettier, Husky

## Engenharia de Qualidade (QA)

Este projeto adotou uma cultura de qualidade rigorosa, utilizando a metodologia **TDD (Test Driven Development)** para o desenvolvimento de regras de negócio complexas e componentes críticos. A integridade do código é assegurada por múltiplas camadas de verificação automatizada.

### Pipeline de CI/CD
O repositório conta com uma esteira de Integração Contínua (GitHub Actions) que executa as seguintes validações a cada *Push* ou *Pull Request*:

1.  **Linting (ESLint):** Análise estática para garantir padrões de código e prevenir erros comuns (ex: regras do Airbnb/Standard).
2.  **Formatação (Prettier):** Verificação de estilo de código consistente.
3.  **Type Checking (TSC):** Validação estática de tipos TypeScript para garantir que não existem erros de compilação.
4.  **Testes Unitários (Vitest):** Execução da suíte de testes isolados para hooks e componentes.
5.  **Testes E2E (Playwright):** Simulação de fluxos reais do usuário (Cadastro, Busca, Agendamento) em navegador *headless*.

### Git Hooks (Husky)
Para impedir que código fora do padrão chegue ao repositório, utilizamos o **Husky** para executar *pre-commit hooks*. Isso garante que testes e linting sejam aprovados localmente antes da confirmação do código.

## Comandos de Desenvolvimento

Abaixo estão os comandos principais para interagir com o projeto e validar a qualidade localmente.

### Instalação e Execução

```bash
# Clonar repositório
git clone https://github.com/LacerdaAcacio/agendei-tcc.git

# Entrar na pasta
cd web

# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

### Verificação de Qualidade

```bash
# Rodar Testes Unitários (Vitest)
npm run test

# Rodar Linting (Análise Estática)
npm run lint

# Corrigir erros de Lint automaticamente
npm run lint:fix

# Verificar Tipagem TypeScript
npm run type-check
```

### Testes End-to-End (E2E)

```bash
# Executar testes E2E (Headless)
npx playwright test

# Abrir interface de relatório de testes
npx playwright show-report
```

### Gestão

Acompanhe o progresso do projeto no Trello:
[Board Agendei](https://trello.com/invite/b/6923691dc80ae47b7f0729f8/ATTI39f8a221bb69fd07e5cafddd97ac5004A6DA3F14/agendai)

## Funcionalidades Chave

### Optimistic UI
Implementação de feedback visual instantâneo para ações de usuário (ex: favoritar serviços), revertendo o estado apenas em caso de falha na requisição, proporcionando uma experiência de uso fluida.

### Integrações
- **BrasilAPI:** Autocompletar e validação de endereços via CEP.
- **OpenStreetMap:** Renderização de mapas e geolocalização para descoberta de serviços.

### Design System
- **Dark Mode:** Suporte nativo a temas claro e escuro via Tailwind.
- **i18n:** Internacionalização preparada para escalabilidade (PT, EN, ES).

---

**Desenvolvido por Acácio de Oliveira Lacerda Neto**