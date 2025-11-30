# Backend - Sistema de Recrutamento & Seleção

Backend desenvolvido em Go com Gin Framework, GORM e PostgreSQL.

## ⚡ Quick Start

```bash
git clone <repo-url>
cd backend
make setup      # Faz tudo automaticamente!
```

**Pronto!** Acesse http://localhost:8080/docs/index.html

**Login:** admin@recruitment.com / admin123

---

## 🚀 Tecnologias

- **Go 1.21+**
- **Gin Web Framework** - HTTP router
- **GORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação com access e refresh tokens
- **Docker & Docker Compose** - Containerização

## 📋 Pré-requisitos

- **Go 1.21+** - [Instalar Go](https://go.dev/doc/install)
- **PostgreSQL 15** (ou Docker)
- **Make** - Para comandos simplificados

## ⚙️ Configuração

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=recruitment_db

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=168h

PORT=8080
GIN_MODE=debug
```

### 2. Instalar dependências e configurar Swagger

```bash
make install           # Instala dependências
make swagger-install   # Instala Swagger CLI
make swagger           # Gera documentação Swagger
```

## 🏃 Executar Aplicação

### 🚀 Setup Completo em Um Comando (Recomendado)

Para fazer **tudo de uma vez** (instalação, configuração, docker e seed):

```bash
make setup
```

**O que este comando faz:**
1. ✅ Instala dependências Go
2. ✅ Instala Swagger CLI
3. ✅ Gera documentação Swagger
4. ✅ Sobe containers Docker (build + up)
5. ✅ Aguarda containers ficarem prontos
6. ✅ Popula banco com dados de exemplo

**Resultado:** Aplicação pronta em ~30 segundos! 🎉

### ⚙️ Setup Manual (Passo a Passo)

Se preferir executar cada etapa separadamente:

```bash
make install          # 1. Instalar dependências
make swagger-install  # 2. Instalar Swagger CLI
make swagger          # 3. Gerar documentação
make docker-up        # 4. Subir containers
make seed             # 5. Popular com dados
```

### 🌐 Acesso

Após o setup, a aplicação estará disponível em:
- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/docs/index.html
- **Health Check**: http://localhost:8080/health

## 🌱 Dados de Exemplo (Seed)

O comando `make seed` cria usuários e vagas de exemplo:

**Usuários criados:**

| Tipo | Email | Senha |
|------|-------|-------|
| Admin (Recrutador) | admin@recruitment.com | admin123 |
| Candidato | joao.silva@email.com | candidate123 |
| Candidato | maria.santos@email.com | candidate123 |

**Vagas criadas:**
- Desenvolvedor Frontend React (Remoto)
- Desenvolvedor Backend Go (Híbrido)
- Desenvolvedor Full Stack (Remoto)
- DevOps Engineer (Presencial)
- Desenvolvedor Mobile React Native (Remoto)
- Tech Lead - Desenvolvimento (Híbrido)
- Estágio em Desenvolvimento Web (Presencial)

## 📚 Estrutura do Projeto

```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # Entry point
├── internal/
│   ├── config/
│   │   └── config.go               # Configurações
│   ├── database/
│   │   └── postgres.go             # Conexão e migrations
│   ├── models/
│   │   ├── user.go                 # Model User
│   │   ├── job.go                  # Model Job
│   │   └── application.go          # Model Application
│   ├── handlers/
│   │   ├── auth_handler.go         # Auth endpoints
│   │   ├── job_handler.go          # Job endpoints
│   │   └── application_handler.go  # Application endpoints
│   ├── middleware/
│   │   ├── auth.go                 # JWT middleware
│   │   └── role.go                 # Role-based access
│   └── repository/
│       ├── user_repository.go
│       ├── job_repository.go
│       └── application_repository.go
├── pkg/
│   ├── jwt/
│   │   └── jwt.go                  # JWT utilities
│   └── utils/
│       └── password.go             # Password hashing
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── Makefile
└── README.md
```

## 🔌 Endpoints da API

### Auth

```
POST   /api/auth/register          # Cadastro
POST   /api/auth/login             # Login
POST   /api/auth/refresh           # Refresh token
GET    /api/auth/me                # Dados do usuário [Protected]
```

### Jobs

```
GET    /api/jobs                   # Listar vagas (com filtros)
GET    /api/jobs/:id               # Detalhes da vaga
POST   /api/jobs                   # Criar vaga [Admin only]
PUT    /api/jobs/:id               # Atualizar vaga [Admin only]
DELETE /api/jobs/:id               # Deletar vaga [Admin only]
GET    /api/jobs/my-jobs           # Minhas vagas [Admin only]
GET    /api/jobs/:id/applications  # Candidatos da vaga [Admin only]
```

### Applications

```
POST   /api/applications                    # Candidatar-se [Candidate only]
GET    /api/applications/my-applications    # Minhas candidaturas [Candidate only]
PUT    /api/applications/:id                # Atualizar status [Admin only]
```

## 🔒 Autenticação

### Registro

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Resposta:**

```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Usar Token

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

## 🛠️ Comandos Make

### Setup e Inicialização

```bash
make setup             # 🚀 Setup completo (tudo de uma vez)
make install           # 📦 Instalar dependências
make swagger-install   # 🔧 Instalar Swagger CLI
make swagger           # 📝 Gerar documentação Swagger
make docker-up         # 🐳 Subir containers
make seed              # 🌱 Popular banco com dados
```

### Desenvolvimento

```bash
make run               # ▶️  Executar localmente (sem Docker)
make build             # 🔨 Build binary
make test              # 🧪 Executar testes
make docker-logs       # 📋 Ver logs do Docker
```

### Gerenciamento Docker

```bash
make docker-down           # ⏹️  Parar containers
make docker-restart        # 🔄 Reiniciar containers
make docker-rebuild        # 🔁 Rebuild completo
make docker-down-clean     # 🧹 Parar e limpar banco
make reset                 # 🔄 Reset completo (limpar + setup)
```

### Outros

```bash
make help              # ❓ Mostrar todos os comandos
make clean             # 🗑️  Limpar arquivos de build
```

## 📖 Documentação da API (Swagger)

### Setup Rápido

```bash
make install           # 1. Instalar dependências
make swagger-install   # 2. Instalar Swagger CLI (apenas primeira vez)
make swagger           # 3. Gerar documentação
make run               # 4. Iniciar servidor
```

### Acessar Swagger

- **Swagger UI**: http://localhost:8080/docs/index.html
- **JSON Spec**: http://localhost:8080/docs/doc.json

### 🔐 Testar Endpoints Autenticados

1. Abra o Swagger UI
2. Use `/api/auth/register` ou `/api/auth/login`
3. Copie o `access_token` da resposta
4. Clique em **"Authorize"** 🔒
5. Digite: `Bearer {seu_access_token}`
6. Teste os endpoints protegidos!

### 🔄 Atualizar Documentação

Se você modificar os handlers, regenere a documentação:

```bash
make swagger
```

## 🗄️ Banco de Dados

As migrations rodam automaticamente ao iniciar a aplicação.

### Modelos:

- **users**: Usuários (admin/candidate)
- **jobs**: Vagas
- **applications**: Candidaturas

### Constraints:

- Email único
- Um candidato só pode se candidatar uma vez por vaga
- Soft delete em todos os modelos

## 🔐 Roles

- **admin**: Pode criar, editar, deletar vagas e gerenciar candidaturas
- **candidate**: Pode se candidatar a vagas e ver suas candidaturas

## 📝 License

MIT
