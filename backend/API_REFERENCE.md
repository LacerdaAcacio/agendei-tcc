# 📘 Agendei API - Referência Técnica

Este documento detalha os endpoints disponíveis na API, seus parâmetros, schemas de validação e regras de negócio.

**Base URL:** `/api/v1`

---

## 🔐 Auth (`/auth`)

### `POST /auth/register`
Registra um novo usuário (Cliente ou Prestador).
* **Auth:** Pública
* **Body Schema (JSON):**
  * `name` (Obrigatório): String (min 2 chars).
  * `email` (Obrigatório): String (Email válido).
  * `password` (Obrigatório): String (min 6 chars).
  * `phone` (Opcional): String.
  * `document` (Obrigatório): String (min 11 chars, CPF/CNPJ).
  * `documentType` (Obrigatório): Enum (`CPF`, `CNPJ`).
  * **Nota:** O campo `role` foi removido. Todos nascem como `client`.

### `POST /auth/login`
Autentica um usuário e retorna o token JWT.
* **Auth:** Pública
* **Body Schema (JSON):**
  * `email` (Obrigatório): String.
  * `password` (Obrigatório): String.

---

## 👥 Users (`/users`)

### `POST /users`
Cria um usuário (Alternativa ao `/auth/register`).
* **Auth:** Pública
* **Body Schema:** Idêntico ao `/auth/register`.

### `GET /users`
Lista todos os usuários.
* **Auth:** Pública
* **Response:** Array de usuários.

### `GET /users/:id`
Obtém detalhes de um usuário.
* **Path Param:** `id` (UUID).
* **Auth:** Pública

### `PUT /users/:id`
Atualiza dados de um usuário.
* **Path Param:** `id` (UUID).
* **Auth:** Pública
* **Body Schema (Opcional):**
  * `name`: String (min 2).
  * `email`: String (Email válido).
  * `password`: String (min 6).
  * `phone`: String.
  * `role`: Enum (`client`, `provider`, `admin`).

### `DELETE /users/:id`
Remove um usuário.
* **Path Param:** `id` (UUID).
* **Auth:** Pública

---

## 🛠️ Services (`/services`)

### `GET /services/search`
Busca serviços com filtros avançados.
* **Auth:** Pública
* **Query Params:**
  * `location`: String.
  * `categoryId`: UUID da categoria.
  * `category`: Slug da categoria (ex: `faxina`).
  * `search`: Palavra-chave (título ou descrição).
  * `type`: Enum (`PRESENTIAL`, `DIGITAL`).
  * `startDate`: ISO Date.
  * `endDate`: ISO Date.
  * `minPrice`: Number.
  * `maxPrice`: Number.

### `POST /services`
Cria um novo serviço.
* **Auth:** Bearer Token (Requer Login).
* **Body Schema (JSON):**
  * `title` (Obrigatório): String (min 3).
  * `description` (Obrigatório): String (min 10).
  * `price` (Obrigatório): Number (positivo).
  * `location` (Obrigatório): String (min 3).
  * `latitude` (Obrigatório): Number (-90 a 90).
  * `longitude` (Obrigatório): Number (-180 a 180).
  * `images` (Obrigatório): Array de URLs (min 1).
  * `categoryId` (Obrigatório): UUID.
  * `type` (Opcional): Enum (`PRESENTIAL`, `DIGITAL`). Default: `PRESENTIAL`.
  * `hostYears` (Opcional): Int. Default: `1`.
  * `hostLanguages` (Opcional): Array de Strings. Default: `['Português']`.
  * `hostJob` (Opcional): String. Default: `Profissional`.
  * `highlights` (Opcional): Array de Strings. Default: `[]`.

### `GET /services`
Lista todos os serviços.
* **Auth:** Pública

### `GET /services/:id`
Obtém detalhes de um serviço.
* **Path Param:** `id` (UUID).
* **Auth:** Pública

### `PUT /services/:id`
Atualiza um serviço existente.
* **Path Param:** `id` (UUID).
* **Auth:** Bearer Token.
* **Body Schema:** Mesmos campos do POST, todos opcionais.

### `DELETE /services/:id`
Remove um serviço.
* **Path Param:** `id` (UUID).
* **Auth:** Bearer Token.

---

## 🏠 Home (`/home`)

### `GET /home`
Retorna categorias com uma prévia dos serviços (Top 10 por rating).
* **Auth:** Pública
* **Response:** Lista de categorias, cada uma contendo um array `services`.

---

## ⚠️ Módulos Faltantes

### 📅 Appointments / Bookings
**Status:** ❌ Não encontrado.
O módulo de agendamentos (`appointments` ou `bookings`) não consta na estrutura atual de rotas (`src/app.ts` e `src/modules`). É necessário implementá-lo para permitir a criação de reservas.
