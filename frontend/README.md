# Frontend - Sistema de Recrutamento & Seleção

Frontend desenvolvido em React + TypeScript + Vite com autenticação JWT e proteção de rotas.

## Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilização

## Pré-requisitos

- Node.js 18+ e npm/yarn
- Backend rodando em `http://localhost:8080`

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Executar Aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Build para Produção

```bash
npm run build
npm run preview
```

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── jobs/              # Componentes de vagas
│   │   ├── applications/      # Componentes de candidaturas
│   │   └── common/            # Componentes comuns
│   ├── contexts/
│   │   └── AuthContext.tsx    # Context de autenticação
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── CandidateDashboard.tsx
│   │   ├── MyApplications.tsx
│   │   ├── JobDetails.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── JobForm.tsx
│   │   └── JobApplications.tsx
│   ├── services/
│   │   ├── api.ts             # Axios config + interceptors
│   │   ├── auth.service.ts
│   │   ├── job.service.ts
│   │   └── application.service.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── job.ts
│   │   └── application.ts
│   ├── utils/
│   │   ├── storage.ts         # LocalStorage helpers
│   │   └── format.ts          # Formatação
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Funcionalidades

### Autenticação
- Login e registro com validação
- JWT access token (24h) + refresh token (7d)
- Auto-refresh automático quando token expira
- Logout com limpeza de localStorage
- Proteção de rotas baseada em role

### Candidato
- Buscar vagas com filtros (título, localização, tipo, salário)
- Ver detalhes da vaga
- Candidatar-se (apenas uma vez por vaga)
- Ver minhas candidaturas com status

### Recrutador (Admin)
- Criar, editar, deletar vagas
- Alterar status da vaga (aberta/fechada/arquivada)
- Ver lista de vagas criadas
- Ver candidatos por vaga
- Atualizar status de candidatura

## Proteção de Rotas

### Navegação Automática
- Usuário logado tentando acessar `/login` ou `/register` → redireciona para dashboard
- Usuário não logado tentando acessar rotas protegidas → redireciona para `/login`
- Candidato tentando acessar rotas `/admin/*` → redireciona para `/dashboard`
- Admin tentando acessar rotas de candidato → redireciona para `/admin/dashboard`

### Persistência
- Login salvo em `localStorage`
- Atualizar página NÃO desloga o usuário
- Token refresh automático mantém sessão ativa

## Rotas

```
# Públicas (com redirecionamento se autenticado)
/login
/register

# Candidato
/dashboard              # Buscar vagas
/applications           # Minhas candidaturas
/jobs/:id               # Detalhes da vaga

# Admin/Recrutador
/admin/dashboard                # Minhas vagas
/admin/jobs/new                 # Criar vaga
/admin/jobs/:id/edit            # Editar vaga
/admin/jobs/:id/applications    # Candidatos da vaga
```

## Scripts

```bash
npm run dev         # Desenvolvimento
npm run build       # Build produção
npm run preview     # Preview build
npm run lint        # Lint código
```

## Auto-Refresh de Token

O sistema implementa refresh automático:

1. Interceptor detecta resposta 401
2. Usa refresh_token para obter novo access_token
3. Retenta requisição original com novo token
4. Se refresh falhar → logout + redirect `/login`

## Diferenças por Role

| Funcionalidade | Candidato | Admin |
|----------------|-----------|-------|
| Criar vagas | Não | Sim |
| Editar vagas | Não | Sim |
| Candidatar-se | Sim | Não |
| Ver candidatos | Não | Sim |
| Atualizar status candidatura | Não | Sim |

## License

MIT
