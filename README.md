# Clima AI Platform

Uma plataforma completa de coleta, processamento e análise de dados climáticos em tempo real usando uma arquitetura de microsserviços orientada por eventos.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (React + Vite)                     │
│                    Dashboard de Visualização                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API (NestJS)  │
                    │   Port: 3000    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
   │ MongoDB │         │ RabbitMQ │         │ Weather │
   │  Port   │         │   Port   │         │  Data   │
   │  27017  │         │   5672   │         │ Export  │
   └─────────┘         └────┬────┘         │ (CSV/   │
                            │              │  XLSX)  │
                   ┌────────┴────────┐      └────────┘
                   │                 │
            ┌──────▼──────┐    ┌────▼──────┐
            │  Collector  │    │   Worker  │
            │  (Python)   │    │   (Go)    │
            │  Open-Meteo │    │ Consumer  │
            │   API       │    │  RabbitMQ │
            └─────────────┘    └───────────┘
```

## Stack Tecnológico

### Backend
- **NestJS 10.2.10**: Framework backend Node.js
- **TypeScript 5.2.2**: Linguagem de programação
- **MongoDB 7**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticação e autorização
- **PassportJS**: Estratégia de autenticação

### Worker & Collector
- **Go 1.22**: Linguagem compilada para alta performance
- **Python 3.12**: Coleta de dados
- **RabbitMQ 3**: Message broker

### Frontend
- **React 18**: Biblioteca UI
- **Vite**: Build tool e dev server
- **Axios**: Cliente HTTP
- **TanStack React Query**: Gerenciamento de estado
- **TailwindCSS**: Styling

### DevOps
- **Docker & Docker Compose**: Containerização e orquestração
- **Open-Meteo API**: Fonte de dados climáticos gratuita

## Funcionalidades Principais

### 1. Coleta Automática de Dados
- Coleta dados climáticos a cada 60 minutos (configurável)
- Integração com API Open-Meteo (gratuita e sem autenticação)
- Publicação automática em fila RabbitMQ
- Coordenadas padrão: São Paulo (-23.5505, -46.6333)

### 2. Processamento em Tempo Real
- Worker Go consome mensagens da fila
- Enriquecimento de dados
- Armazenamento em MongoDB
- Tratamento de erros com retry automático

### 3. API RESTful
- **GET /weather/logs** - Listar últimos 200 registros
- **POST /weather/logs** - Criar novo registro
- **GET /weather/export.csv** - Exportar em CSV
- **GET /weather/export.xlsx** - Exportar em Excel
- **GET /weather/insights** - Análise de temperatura
- **POST /auth/signin** - Login de usuário
- **POST /auth/signup** - Registro de usuário
- **GET /users** - Listar usuários (autenticado)

### 4. Dashboard Interativo
- Visualização de dados em tempo real
- Gráficos de temperatura
- Tabela de registros
- Exportação de relatórios
- Autenticação com JWT

## Quick Start

### Opção 1: Instalação Automática (macOS)

```bash
cd clima-ai-platform
chmod +x setup.sh
./setup.sh
```

O script irá:
1. Instalar Homebrew (se necessário)
2. Instalar Node.js 18 via nvm
3. Instalar pnpm
4. Instalar Go 1.22
5. Instalar Python 3.12
6. Instalar Docker e Docker Compose
7. Instalar NestJS CLI
8. Compilar todos os serviços
9. Iniciar Docker Compose

### Opção 2: Instalação Manual

#### 1. Pré-requisitos
```bash
# macOS com Homebrew
brew install node go python@3.12 docker

# Linux (Ubuntu/Debian)
sudo apt-get install -y nodejs npm golang python3.12 docker.io docker-compose
```

#### 2. Instalar dependências do projeto
```bash
# API NestJS
cd api-nest
npm install
npm run build

# Frontend React
cd ../frontend
npm install
npm run build

# Collector Python
cd ../collector-python
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Worker Go
cd ../worker-go
go mod download
```

#### 3. Iniciar serviços
```bash
docker-compose up -d
```

## Desenvolvimento

### API NestJS (Dev Mode)
```bash
cd api-nest
npm run start:dev
# API disponível em http://localhost:3000
```

### Frontend React (Dev Mode)
```bash
cd frontend
npm run dev
# Frontend disponível em http://localhost:5173
```

### Collector Python (Local)
```bash
cd collector-python
source venv/bin/activate
python app/main.py
```

### Worker Go (Local)
```bash
cd worker-go
go run main.go
```

## Variáveis de Ambiente

### `.env` na raiz do projeto
```bash
# MongoDB
MONGO_URI=mongodb://mongo:27017/clima_db

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
QUEUE_NAME=weather.raw

# Collector
LATITUDE=-23.5505
LONGITUDE=-46.6333
INTERVAL_MINUTES=60

# API
PORT=3000
JWT_SECRET=your-secret-key-here

# Admin
ADMIN_EMAIL=admin@clima.ai
ADMIN_PASSWORD=admin123456
```

## Endpoints da API

### Autenticação
```
POST /auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}

POST /auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "preferences": {
    "locations": ["São Paulo"],
    "units": "celsius",
    "notifications": true
  }
}
```

### Dados Climáticos
```
GET /weather/logs
GET /weather/logs?limit=50

POST /weather/logs
{
  "timestamp": "2024-01-01T12:00:00Z",
  "temperature": 25.5,
  "windspeed": 10,
  "winddirection": 180,
  "city": "São Paulo"
}

GET /weather/export.csv
GET /weather/export.xlsx

GET /weather/insights
```

## Estrutura de Diretórios

```
clima-ai-platform/
├── api-nest/                 # API NestJS
│   ├── src/
│   │   ├── auth/            # Módulo de autenticação
│   │   ├── weather/         # Módulo de dados climáticos
│   │   ├── users/           # Módulo de usuários
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── Dockerfile
├── frontend/                 # Frontend React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── Dockerfile
├── collector-python/         # Coleta de dados climáticos
│   ├── app/
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── worker-go/               # Worker de processamento
│   ├── main.go
│   ├── go.mod
│   └── Dockerfile
├── docker-compose.yml       # Orquestração de containers
├── setup.sh                # Script de setup macOS
└── README.md              # Este arquivo
```

## Monitoramento e Logs

### Ver logs dos serviços
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f api
docker-compose logs -f collector
docker-compose logs -f worker
docker-compose logs -f frontend

# Últimas 100 linhas
docker-compose logs -f --tail=100 api
```

### Acessar RabbitMQ Management
```
URL: http://localhost:15672
Usuário: guest
Senha: guest
```

### Conectar ao MongoDB
```bash
mongosh mongodb://localhost:27017/clima_db
```

## Troubleshooting

### 1. Erro: "Docker daemon is not running"
```bash
# Iniciar Docker Desktop (macOS)
open /Applications/Docker.app
```

### 2. Erro: "Port already in use"
```bash
# Listar processos usando a porta
lsof -i :3000
lsof -i :5173

# Matar processo (macOS)
kill -9 <PID>
```

### 3. Erro: "ECONNREFUSED" ao conectar ao MongoDB
```bash
# Verificar se MongoDB está rodando
docker-compose ps

# Reiniciar container
docker-compose restart mongo
```

### 4. Collector não está coletando dados
```bash
# Verificar logs do collector
docker-compose logs -f collector

# Verificar fila RabbitMQ
# Acessar http://localhost:15672
# Verificar se há mensagens na fila 'weather.raw'
```

### 5. Worker não está processando mensagens
```bash
# Verificar logs do worker
docker-compose logs -f worker

# Verificar se API está respondendo
curl http://localhost:3000/health
```

## Performance e Otimizações

### MongoDB
- Índices criados automaticamente
- Timestamps em todos os documentos
- Limite de 200 registros por query padrão

### RabbitMQ
- Fila durável `weather.raw`
- Retry automático em caso de erro
- TTL de mensagens configurável

### Go Worker
- Processamento paralelo de mensagens
- Connection pooling para HTTP
- Graceful shutdown

### Node.js
- Cache com React Query
- Lazy loading de componentes
- Minification em produção

## Segurança

### Autenticação
- JWT com expiração de 24 horas
- Senhas armazenadas com hash (bcrypt)
- Tokens no header Authorization

### Validação
- Class Validator para DTOs
- Sanitização de inputs
- CORS habilitado para frontend

### Dados Sensíveis
- JWT_SECRET em variável de ambiente
- Credenciais RabbitMQ em .env
- MongoDB URI protegida

## Contribuindo

1. Criar branch: `git checkout -b feature/minha-feature`
2. Commitar mudanças: `git commit -am 'Add minha-feature'`
3. Push: `git push origin feature/minha-feature`
4. Criar Pull Request

## Roadmap

- [ ] Dashboard com gráficos avançados (Chart.js)
- [ ] Predição de temperatura com ML
- [ ] Notificações via email/SMS
- [ ] Multi-região com dados de diferentes cidades
- [ ] API de webhook para integrações
- [ ] Planos de subscripção
- [ ] Mobile app (React Native)
- [ ] GraphQL API alternative



