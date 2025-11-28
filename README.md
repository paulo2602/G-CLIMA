# 🌤️ GDASH CLIMA - Plataforma de Análise Climática em Tempo Real

Uma plataforma completa de coleta, processamento e análise de dados climáticos usando arquitetura de **microsserviços** orientada por eventos com 6 containers Docker.

---

## 🚀 Início Rápido

### ✅ Pré-requisitos
- Docker e Docker Compose instalados
- Git

### 🐳 Rodar Tudo com Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/paulo2602/G-CLIMA.git
cd G-CLIMA

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie todos os serviços
docker-compose up -d

# Aguarde ~30 segundos
sleep 30

# Verifique se tudo está rodando
docker-compose ps
```

**Todos os 6 containers devem estar com status UP:**
- ✅ mongo (MongoDB)
- ✅ rabbitmq (RabbitMQ)
- ✅ api (NestJS API)
- ✅ frontend (React + Vite)
- ✅ collector (Python)
- ✅ worker (Go)

---

## 📍 URLs Principais

| Serviço | URL | Acesso |
|---------|-----|--------|
| **Frontend** | http://localhost:5173 | admin / admin |
| **API (REST)** | http://localhost:3000/weather/logs | - |
| **Swagger** | http://localhost:3000/api | - |
| **RabbitMQ** | http://localhost:15672 | guest / guest |
| **MongoDB** | localhost:27017 | root / password |

---

## 👤 Usuário Padrão para Acesso Inicial

```
Email: admin@clima.ai
Usuário: admin
Senha: admin
```

⚠️ **Altere essas credenciais em produção!**

---

## 📺 Vídeo Explicativo

🎬 **Link do vídeo (YouTube não listado):**
- Duração: 5 minutos
- Conteúdo: Arquitetura, pipeline, IA, decisões técnicas e demo
- Link: [Inserir link do vídeo aqui]

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (React + Vite)                     │
│              Dashboard com Dark Mode & Responsivo                │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                    ┌────────▼────────┐
                    │   API (NestJS)  │
                    │   Port: 3000    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
   │ MongoDB │         │ RabbitMQ │         │ Weather │
   │  Port   │         │ Fila MSG │         │ Export  │
   │  27017  │         │   5672   │         │CSV/XLSX │
   └─────────┘         └────┬────┘         └────────┘
                            │
                   ┌────────┴────────┐
                   │                 │
            ┌──────▼──────┐    ┌────▼──────┐
            │  Collector  │    │   Worker  │
            │  (Python)   │    │   (Go)    │
            │ OpenWeather │    │ Consumer  │
            │   API       │    │  RabbitMQ │
            └─────────────┘    └───────────┘
```

---

## 📦 Componentes do Projeto

### **Frontend** (React + Vite)
- 📁 `frontend/`
- Dashboard responsivo com cards climáticos
- Dark mode toggle
- Página Explore com insights
- Exportação de dados (CSV/XLSX)
- Autenticação JWT

### **API Backend** (NestJS)
- 📁 `api-nest/`
- 16 endpoints para gerenciamento de dados
- Autenticação com JWT
- Validação com Class Validator
- Cálculo de probabilidade de chuva
- Geração de insights de IA

### **Collector** (Python)
- 📁 `collector-python/`
- Coleta de dados OpenWeather a cada 60 minutos
- Publicação em fila RabbitMQ
- Configuração de coordenadas (default: São Paulo)

### **Worker** (Go)
- 📁 `worker-go/`
- Consumer de mensagens RabbitMQ
- HTTP POST automático para API
- Retry com backoff exponencial
- Processamento paralelo

### **Docker Compose**
- 📄 `docker-compose.yml`
- Orquestração de 6 containers
- Networking interno
- Volumes persistentes

---

## 🔧 Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

**Principais variáveis:**

```env
# Banco de dados
MONGODB_ROOT_USERNAME=root
MONGODB_ROOT_PASSWORD=password
MONGODB_DB=clima_db

# API
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development

# Autenticação (padrão)
ADMIN_USER=admin
ADMIN_PASSWORD=admin

# APIs Externas
OPENWEATHER_API_KEY=sua-chave-aqui

# Frontend
VITE_API_URL=http://localhost:3000
```

Consulte `.env.example` para a **lista completa** de todas as variáveis possíveis.

---

## 🐍 Executar Collector Python Localmente

```bash
# Navegue até o diretório
cd collector-python

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate  # Windows

# Instale as dependências
pip install -r requirements.txt

# Execute
python app/main.py
```

**O que faz:**
- ✅ Coleta dados climáticos da OpenWeather API
- ✅ Publica mensagens na fila RabbitMQ `weather.raw`
- ✅ Executa a cada 60 minutos (configurável)

---

## 🐹 Executar Worker Go Localmente

```bash
# Navegue até o diretório
cd worker-go

# Compile
go build -o worker

# Execute
./worker
```

**O que faz:**
- ✅ Escuta a fila RabbitMQ `weather.raw`
- ✅ Consome mensagens de dados climáticos
- ✅ Faz POST para API em `/weather/logs`
- ✅ Reconecta automaticamente se falhar

---

## 🔄 Pipeline de Dados

```
1. Collector Python
   ↓ (a cada 60 minutos)
2. RabbitMQ (fila weather.raw)
   ↓ (durável, persiste em disco)
3. Worker Go (consumer)
   ↓ (POST /weather/logs)
4. API NestJS
   ↓ (valida + calcula chuva + timestamps)
5. MongoDB (persiste)
   ↓
6. Frontend React
   ↓ (GET /weather/logs)
7. Dashboard (renderiza cards)
```

---

## 🤖 Inteligência Artificial

### 🌧️ Probabilidade de Chuva
- **66+ codes de clima** mapeados da OpenWeather
- Conversão para probabilidade (0-95%)
- **Cores codificadas** no Frontend:
  - 🟢 Verde: 0-30% (sem chuva/leve)
  - 🟡 Amarelo: 30-60% (moderada)
  - 🟠 Laranja: 60-80% (forte)
  - 🔴 Vermelho: 80-95% (muito forte)

### 🌡️ Análise de Temperatura
- Análise dos **últimos 48 registros**
- Calcula **temperatura média**
- Classifica clima:
  - ❄️ Frio: ≤18°C
  - 😊 Agradável: 18-30°C
  - 🔥 Quente: ≥30°C
- Gera **resumo narrativo automático**

---

## 📊 API Endpoints Principais

### Autenticação
```
POST   /auth/login         # Fazer login
POST   /auth/register      # Criar conta nova
```

### Dados Climáticos
```
GET    /weather/logs       # Listar todos os dados
POST   /weather/logs       # Criar novo registro
GET    /weather/insights   # Insights da IA
GET    /weather/export.csv # Exportar CSV
GET    /weather/export.xlsx # Exportar Excel
```

### Usuários
```
GET    /users              # Listar usuários
GET    /users/:id          # Detalhes do usuário
```

---

## 📋 Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React + Vite + TypeScript | 18 + 5.2 + 5.2 |
| **Backend** | NestJS + TypeScript | 10.2.10 + 5.2.2 |
| **Banco** | MongoDB + Mongoose | 7 + 7.0 |
| **Message Broker** | RabbitMQ | 3 |
| **Worker** | Go | 1.22 |
| **Collector** | Python | 3.12 |
| **Orquestração** | Docker Compose | v3.9 |

---

## 🧪 Desenvolvimento Local

### Frontend
```bash
cd frontend
npm install
npm run dev  # Inicia em http://localhost:5173
```

### API
```bash
cd api-nest
npm install
npm run start:dev  # Inicia em http://localhost:3000
```

### Parar todos os serviços
```bash
docker-compose down
```

### Reiniciar do zero
```bash
docker-compose down -v  # Remove volumes também
docker-compose up -d
```

---

## 📊 Status dos Containers

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f api        # API
docker-compose logs -f collector  # Collector
docker-compose logs -f worker     # Worker

# Acessar MongoDB
mongosh mongodb://localhost:27017 -u root -p password
```

---

## 🐛 Troubleshooting

### Frontend não carrega
```bash
# Verificar se API está rodando
curl http://localhost:3000/weather/logs

# Reiniciar frontend
docker-compose restart frontend
```

### Worker não consome mensagens
```bash
# Ver logs
docker-compose logs worker

# Reiniciar worker
docker-compose restart worker
```

### Sem dados no dashboard
```bash
# Forçar coleta do Collector
docker-compose exec collector python -c "from app.main import collect_weather; collect_weather()"

# Verificar MongoDB
mongosh mongodb://localhost:27017
db.weather.find().limit(1).pretty()
```

---

## 📝 Licença

MIT © 2024 GDASH CLIMA Platform

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Commit: `git commit -m 'Add sua-feature'`
4. Push: `git push origin feature/sua-feature`
5. Abra um Pull Request

---

## 📧 Suporte

- 📋 [Abrir Issue](https://github.com/paulo2602/G-CLIMA/issues)
- 💬 [Discussões](https://github.com/paulo2602/G-CLIMA/discussions)

---

**Desenvolvido com ❤️ para monitoramento de clima em tempo real**



