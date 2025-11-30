# 🎯 Sistema de Recrutamento & Seleção

Sistema completo de recrutamento com backend em **Go** e frontend em **React + TypeScript**.

## ⚡ Quick Start (30 segundos)

### **Opção 1: Setup Automático (Recomendado)**

```bash
# Na raiz do projeto
cd backend
make setup
```

Isso vai:
- ✅ Instalar todas as dependências
- ✅ Gerar documentação Swagger
- ✅ Subir containers Docker (PostgreSQL + Backend)
- ✅ Popular banco com dados de exemplo
- ✅ Deixar tudo pronto para uso!

### **Opção 2: Setup Manual**

```bash
# 1. Backend
cd backend
make install          # Instala dependências
make swagger-install  # Instala Swagger CLI
make swagger          # Gera docs
make docker-up        # Sobe containers
make seed             # Popula banco

# 2. Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

---

## 🌐 URLs de Acesso

Após o setup, acesse:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface React |
| **Backend API** | http://localhost:8080/api | REST API |
| **Swagger** | http://localhost:8080/docs/index.html | Documentação interativa |
| **Health Check** | http://localhost:8080/health | Status da API |

---

## 👤 Credenciais de Teste

O comando `make seed` cria usuários de exemplo:

### 🔑 Admin (Recrutador)
```
Email: admin@recruitment.com
Senha: admin123
```

### 👥 Candidatos
```
Email: joao.silva@email.com
Senha: candidate123

Email: maria.santos@email.com
Senha: candidate123
```

---

## 🏗️ Estrutura do Projeto

```
test-prog/
├── backend/              # API em Go + Gin + GORM
│   ├── cmd/
│   │   ├── server/      # Entry point da API
│   │   └── seed/        # Script de seed do banco
│   ├── internal/
│   │   ├── handlers/    # Controllers (endpoints)
│   │   ├── middleware/  # Auth, CORS, etc
│   │   ├── models/      # Modelos do banco
│   │   └── repository/  # Data access layer
│   ├── pkg/
│   │   ├── jwt/         # Autenticação JWT
│   │   └── utils/       # Funções auxiliares
│   └── docs/            # Swagger gerado
│
└── frontend/            # SPA em React + TypeScript
    ├── src/
    │   ├── components/  # Componentes reutilizáveis
    │   ├── pages/       # Páginas da aplicação
    │   ├── contexts/    # Context API (AuthContext)
    │   ├── services/    # API calls (axios)
    │   └── types/       # TypeScript interfaces
    └── public/
```

---

## 📐 Arquitetura do Sistema

### **Visão Geral**

```mermaid
graph TB
    subgraph "Cliente"
        A[Browser/Frontend React]
    end
    
    subgraph "Backend Go"
        B[Gin Router]
        C[Middlewares: CORS + Auth + Role]
        D[Handlers: Auth/Jobs/Applications]
        E[Repositories: Data Access Layer]
        F[Models: Entities]
    end
    
    subgraph "Database"
        G[(PostgreSQL)]
    end
    
    subgraph "External"
        H[JWT Token]
        I[Swagger Docs]
    end
    
    A -->|HTTP/JSON| B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    D -.->|Generate/Validate| H
    B -.->|Serve| I
    
    style A fill:#4f46e5,stroke:#6366f1,stroke-width:2px,color:#fff
    style B fill:#9333ea,stroke:#a855f7,stroke-width:2px,color:#fff
    style G fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
```

### **Fluxo de Autenticação**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Handler
    participant R as User Repository
    participant DB as PostgreSQL
    participant J as JWT Utils
    
    U->>F: Login (email, password)
    F->>A: POST /api/auth/login
    A->>R: FindByEmail(email)
    R->>DB: SELECT * FROM users WHERE email = ?
    DB-->>R: User data
    R-->>A: User with password hash
    A->>A: bcrypt.Compare(password, hash)
    alt Password válido
        A->>J: GenerateTokenPair(user)
        J-->>A: {access_token, refresh_token}
        A-->>F: 200 OK + tokens + user
        F->>F: Store tokens in localStorage
        F-->>U: Redirect to dashboard
    else Password inválido
        A-->>F: 401 Unauthorized
        F-->>U: Toast error message
    end
```

### **Fluxo de Candidatura**

```mermaid
sequenceDiagram
    participant C as Candidate
    participant F as Frontend
    participant M as Auth Middleware
    participant AH as Application Handler
    participant AR as Application Repo
    participant JR as Job Repo
    participant DB as PostgreSQL
    
    C->>F: Click "Candidatar-se"
    F->>AH: POST /api/applications + JWT
    AH->>M: Validate JWT token
    M->>M: Extract user claims
    M-->>AH: User authenticated
    AH->>JR: FindByID(job_id)
    JR->>DB: SELECT job
    DB-->>JR: Job data
    JR-->>AH: Job found
    AH->>AH: Check job.status == "open"
    AH->>AR: ExistsForJobAndCandidate()
    AR->>DB: SELECT COUNT(*)
    DB-->>AR: 0 (não existe)
    AR-->>AH: false
    AH->>AR: Create(application)
    AR->>DB: INSERT INTO applications
    DB-->>AR: Success
    AR-->>AH: Application created
    AH-->>F: 201 Created + application data
    F-->>C: Toast success + redirect
```

### **Arquitetura Backend (Clean Architecture)**

```mermaid
graph LR
    subgraph "Entry Point"
        A[main.go]
    end
    
    subgraph "HTTP Layer"
        B[Gin Router]
        C[Middlewares]
    end
    
    subgraph "Handler Layer"
        D[Auth Handler]
        E[Job Handler]
        F[Application Handler]
    end
    
    subgraph "Business Layer"
        G[User Repository]
        H[Job Repository]
        I[Application Repository]
    end
    
    subgraph "Data Layer"
        J[GORM ORM]
        K[(PostgreSQL)]
    end
    
    subgraph "Utils"
        L[JWT Utils]
        M[Password Utils]
        N[Text Normalization]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    D --> G
    E --> H
    F --> I
    G --> J
    H --> J
    I --> J
    J --> K
    D -.-> L
    D -.-> M
    H -.-> N
    
    style A fill:#4f46e5,stroke:#6366f1,stroke-width:3px,color:#fff
    style K fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff
    style L fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style M fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style N fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
```

### **Arquitetura Frontend (React)**

```mermaid
graph TB
    subgraph "Entry Point"
        A[main.tsx]
        B[App.tsx]
    end
    
    subgraph "Routing"
        C[React Router v6]
        D[Route Loaders]
    end
    
    subgraph "Context"
        E[AuthContext: User State]
    end
    
    subgraph "Pages"
        F1[Login]
        F2[Register]
        F3[Dashboard]
        F4[Job Details]
        F5[My Applications]
        F6[Admin Dashboard]
    end
    
    subgraph "Components"
        G1[Navbar]
        G2[JobCard]
        G3[JobFilters]
        G4[ApplicationCard]
        G5[Loader]
    end
    
    subgraph "Services"
        H1[Auth Service]
        H2[Job Service]
        H3[Application Service]
    end
    
    subgraph "API"
        I[Axios Instance + Interceptors]
        J[Backend API]
    end
    
    A --> B
    B --> C
    B --> E
    C --> D
    D -.->|Fetch Data| H1
    D -.->|Fetch Data| H2
    C --> F1
    C --> F2
    C --> F3
    C --> F4
    C --> F5
    C --> F6
    F3 --> G1
    F3 --> G2
    F3 --> G3
    F5 --> G4
    F1 -.->|useAuth| E
    F2 -.->|useAuth| E
    H1 --> I
    H2 --> I
    H3 --> I
    I -->|HTTP/JSON| J
    
    style A fill:#4f46e5,stroke:#6366f1,stroke-width:3px,color:#fff
    style E fill:#9333ea,stroke:#a855f7,stroke-width:3px,color:#fff
    style I fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff
    style J fill:#ef4444,stroke:#dc2626,stroke-width:3px,color:#fff
```

### **Modelo de Dados (ER Diagram)**

```mermaid
erDiagram
    USERS ||--o{ JOBS : creates
    USERS ||--o{ APPLICATIONS : submits
    JOBS ||--o{ APPLICATIONS : receives
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        enum role
        timestamp created_at
        timestamp deleted_at
    }
    
    JOBS {
        uuid id PK
        uuid recruiter_id FK
        string title
        text description
        float salary
        string location
        enum type
        enum status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    APPLICATIONS {
        uuid id PK
        uuid job_id FK
        uuid candidate_id FK
        enum status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
```

### **Fluxo de Busca Inteligente**

```mermaid
graph LR
    A["User digita: desenvolvedor frontend"] --> B[Frontend envia query]
    B --> C[Backend NormalizeText]
    C --> D[Remove acentos e pontuação]
    D --> E[Split em palavras]
    E --> F[PostgreSQL translate LIKE]
    F --> G[Match com Desenvolvedor Front-End]
    G --> H[Retorna resultados]
    H --> I[Frontend exibe cards]
    
    style A fill:#4f46e5,stroke:#6366f1,stroke-width:2px,color:#fff
    style D fill:#9333ea,stroke:#a855f7,stroke-width:2px,color:#fff
    style H fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
```

### **Middleware Chain (Proteção de Rotas)**

```mermaid
graph LR
    A[Request] --> B{CORS Middleware}
    B -->|Allow Origin| C{Auth Middleware}
    C -->|Valid JWT?| D{Role Middleware}
    D -->|Has Permission?| E[Handler Execute]
    E --> F[Response]
    
    B -->|Block| G[403 Forbidden]
    C -->|Invalid/Missing| H[401 Unauthorized]
    D -->|No Permission| I[403 Forbidden]
    
    style A fill:#4f46e5,stroke:#6366f1,stroke-width:2px,color:#fff
    style E fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style G fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style H fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style I fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
```

---

## 🛠️ Comandos Úteis

### **Backend**

```bash
# Setup e Inicialização
make setup             # 🚀 Setup completo automático
make docker-up         # Subir containers
make docker-down       # Parar containers
make seed              # Popular banco com dados

# Desenvolvimento
make run               # Rodar localmente (sem Docker)
make test              # Executar testes
make swagger           # Atualizar documentação
make docker-logs       # Ver logs

# Limpeza
make docker-down-clean # Parar e limpar banco
make reset             # Reset completo (limpar + setup)
```

### **Frontend**

```bash
npm run dev            # Desenvolvimento (http://localhost:5173)
npm run build          # Build para produção
npm run preview        # Preview do build
npm run lint           # Verificar código
```

---

## 🔧 Tecnologias Utilizadas

### **Backend**
- **Go 1.21+** - Linguagem
- **Gin** - Web framework (Express do Go)
- **GORM** - ORM (Sequelize do Go)
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Swagger** - Documentação automática
- **Docker** - Containerização

### **Frontend**
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Roteamento + Loaders
- **React Hook Form** - Gerenciamento de forms
- **Axios** - HTTP client
- **Tailwind CSS** - Estilização
- **React Hot Toast** - Notificações

---

## 📚 Funcionalidades

### **Para Candidatos** 👤
- ✅ Buscar vagas (com filtros inteligentes)
- ✅ Ver detalhes das vagas
- ✅ Candidatar-se a vagas
- ✅ Acompanhar suas candidaturas
- ✅ Filtros por: título, localização, tipo, salário

### **Para Recrutadores** 👨‍💼
- ✅ Criar, editar e deletar vagas
- ✅ Gerenciar vagas criadas
- ✅ Ver candidatos por vaga
- ✅ Atualizar status de candidaturas
- ✅ Dashboard administrativo

### **Sistema** ⚙️
- ✅ Autenticação JWT (access + refresh tokens)
- ✅ Busca inteligente (ignora acentos e pontuação)
- ✅ Validação de dados (backend + frontend)
- ✅ Error handling robusto
- ✅ UI/UX moderna com animações
- ✅ Responsive design
- ✅ API documentada (Swagger)

---

## 🔍 Exemplos de Uso

### **Busca Inteligente**

A busca funciona mesmo sem acentos ou pontuação:

```
✅ "desenvolvedor frontend" → Encontra "Desenvolvedor Front-End"
✅ "estagio" → Encontra "Estágio em Programação"
✅ "devops" → Encontra "DevOps Engineer"
```

### **Filtros Avançados**

```bash
# Buscar vagas remotas com salário mínimo de R$ 8.000
Filtros:
- Tipo: Remoto
- Salário Mínimo: 8.000
- Busca: "desenvolvedor"
```

---

## 🚨 Troubleshooting

### **Porta 8080 já está em uso**

```bash
# Encontrar e matar processo
lsof -ti:8080 | xargs kill -9

# Ou mudar porta no .env
PORT=8081
```

### **Erro ao conectar no PostgreSQL**

```bash
# Verificar se container está rodando
docker ps

# Recriar containers
cd backend
make docker-down-clean
make docker-up
```

### **Frontend não conecta no backend**

```bash
# Verificar variável de ambiente
cat frontend/.env

# Deve ter:
VITE_API_URL=http://localhost:8080
```

### **Swagger não aparece**

```bash
cd backend
make swagger        # Regenerar docs
make docker-restart # Reiniciar backend
```

---

## 📖 Documentação Detalhada

- **Backend**: Veja [backend/README.md](./backend/README.md)
- **API Docs**: http://localhost:8080/docs/index.html (após iniciar)

---

## 🧪 Testes

### **Backend**

```bash
cd backend
make test              # Rodar todos os testes
go test -v ./...       # Verbose
go test -cover ./...   # Com coverage
```

### **Frontend**

```bash
cd frontend
npm run test           # Se houver testes configurados
```

---

## 🐳 Docker

### **Containers**

```bash
# Ver containers rodando
docker ps

# Logs do backend
docker logs recruitment_backend -f

# Logs do PostgreSQL
docker logs recruitment_postgres -f

# Acessar shell do container
docker exec -it recruitment_backend sh
```

### **Banco de Dados**

```bash
# Conectar no PostgreSQL
docker exec -it recruitment_postgres psql -U postgres -d recruitment_db

# Ver tabelas
\dt

# Ver usuários
SELECT email, role FROM users;

# Sair
\q
```

---

## 🎨 Paleta de Cores

O sistema usa gradientes modernos:

- **Primário**: Indigo (#4f46e5) → Purple (#9333ea)
- **Secundário**: Pink (#ec4899)
- **Sucesso**: Green (#10b981) → Emerald (#059669)
- **Erro**: Red (#ef4444) → Pink (#ec4899)

---

**Pronto para começar? Execute `cd backend && make setup` e em 30 segundos estará tudo rodando! 🚀**

