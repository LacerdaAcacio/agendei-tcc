# Agendei API - Service Scheduling Platform

API RESTful desenvolvida em Node.js para gestão de agendamentos de serviços locais. O projeto foca na integridade de dados (ACID), prevenção de conflitos de horário e escalabilidade modular.

## Arquitetura

O projeto segue o padrão **Modular Monolith**, organizando o código por domínios de negócio em vez de camadas técnicas puras. Cada módulo (Users, Services, Bookings) possui sua própria estrutura interna seguindo o fluxo:

`Controller` -> `Service` (Regras de Negócio) -> `Repository` (Acesso a Dados)

Isso mantém a coesão alta e o acoplamento baixo, facilitando a manutenção e testes.

## Tecnologias

*   **Runtime:** Node.js
*   **Framework:** Express
*   **Linguagem:** TypeScript
*   **Database:** PostgreSQL (Produção) / SQLite (Dev)
*   **ORM:** Prisma
*   **Validação:** Zod
*   **Testes:** Jest

## Destaques Técnicos

### Motor de Disponibilidade (Slots Engine)
Algoritmo robusto para cálculo de horários livres.
*   Geração dinâmica de slots baseada na duração do serviço + buffer.
*   Prevenção de *double-booking* usando verificação de interseção de intervalos (`StartA < EndB && EndA > StartB`).
*   Tratamento de Timezones para garantir precisão nas datas.

### Segurança
*   Autenticação via **JWT** (JSON Web Tokens).
*   Controle de acesso baseado em funções (RBAC) para Clientes e Prestadores.
*   Senhas criptografadas com **Bcrypt**.

### Validação Rigorosa
*   Todos os inputs são validados com **Zod** antes de atingir a camada de serviço.
*   Validação de formato de documentos (CPF/CNPJ).

## Como Rodar

### Pré-requisitos
*   Node.js (v18+)
*   NPM ou Yarn

### Passo a Passo

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/LacerdaAcacio/agendei-tcc.git
    cd backend
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente**
    Crie um arquivo `.env` na raiz baseado no `.env.example`:
    ```bash
    cp .env.example .env
    ```

4.  **Banco de Dados**
    Rode as migrations para criar as tabelas:
    ```bash
    npx prisma migrate dev
    ```

5.  **Seed (Dados Iniciais)**
    Popule o banco com dados de teste (Categorias, Usuários, Serviços):
    ```bash
    npx prisma db seed
    ```

6.  **Inicie o Servidor**
    ```bash
    npm run dev
    ```
    O servidor rodará em `http://localhost:3333`.

## Planejamento

Acompanhe o progresso e o roadmap do projeto no Trello:
[Agendei - Quadro de Tarefas](https://trello.com/invite/b/6923691dc80ae47b7f0729f8/ATTI39f8a221bb69fd07e5cafddd97ac5004A6DA3F14/agendai)
