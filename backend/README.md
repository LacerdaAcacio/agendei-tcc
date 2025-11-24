# Agendei Backend API

Professional RESTful API for **Agendei** - A service scheduling system built with Clean Architecture principles.

## 🏗️ Architecture

This project follows **Clean Architecture** and **Layered Architecture** patterns:

```
src/
├── modules/              # Domain modules (Users, Appointments)
│   ├── users/
│   │   ├── UsersController.ts    # HTTP layer
│   │   ├── UsersService.ts       # Business logic
│   │   ├── UsersRepository.ts    # Data access
│   │   ├── users.schema.ts       # Validation schemas
│   │   └── users.routes.ts       # Route definitions
│   └── appointments/
│       └── ... (same structure)
├── shared/               # Shared infrastructure
│   ├── middlewares/      # Error handling, validation
│   ├── errors/           # Custom error classes
│   └── providers/        # External services (email, etc.)
├── config/               # Configuration files
│   ├── env.ts           # Environment variables
│   └── swagger.ts       # API documentation config
├── app.ts               # Express app setup
└── server.ts            # Entry point
```

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma (SQLite for dev, PostgreSQL/MongoDB ready)
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## ⚙️ Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Initialize the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

## 🚦 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 📚 API Documentation

Once the server is running, visit http://localhost:3000/api-docs for interactive API documentation powered by Swagger UI.

### Main Endpoints

- `GET /health` - Health check
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments` - List all appointments
- `GET /api/v1/appointments/:id` - Get appointment by ID
- `GET /api/v1/appointments/user/:userId` - Get user appointments
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Delete appointment

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Zod schema validation
- **Error Handling**: Centralized error management

## 📦 Database

This project uses **Prisma ORM** with:
- **Development**: SQLite (no setup required)
- **Production**: PostgreSQL or MongoDB (update `DATABASE_URL` in `.env`)

### Database Models

- **User**: User accounts (client, provider, admin)
- **Appointment**: Service scheduling with conflict detection

## 🎯 Key Features

- ✅ Clean Architecture with separation of concerns
- ✅ Type-safe with strict TypeScript
- ✅ Automatic API documentation (Swagger)
- ✅ Comprehensive input validation (Zod)
- ✅ Integration tests (Supertest)
- ✅ Security best practices
- ✅ Appointment conflict detection
- ✅ Graceful server shutdown
- ✅ Development/Production environment support

## 📝 Code Quality

This project enforces code quality through:
- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Consistent code formatting
- **Jest**: Testing with coverage reports

## 🤝 Contributing

1. Follow the established architecture patterns
2. Write tests for new features
3. Run `npm run lint` and `npm run format` before committing
4. Update API documentation for new endpoints

## 📄 License

MIT

---

**Built for TCC (Thesis Project) - Professional Grade Backend API**
