# Quick Start - Clima AI Platform

## Em 3 Minutos

### Opção 1: Automático (macOS)
```bash
cd ~/Documents/clima-ai-platform
./setup.sh
```

### Opção 2: Manual
```bash
# 1. Instalar dependências
cd api-nest && npm install && npm run build && cd ..
cd frontend && npm install && npm run build && cd ..

# 2. Iniciar Docker
docker-compose up -d

# 3. Aguardar ~30 segundos
sleep 30

# 4. Pronto!
echo "Plataforma rodando!"
```

---

## Acessar Serviços

### Frontend
```
http://localhost:5173
```

### API
```
GET http://localhost:3000/weather/logs
```

### RabbitMQ Management
```
http://localhost:15672
guest/guest
```

### MongoDB
```
mongosh mongodb://localhost:27017/clima_db
```

---

## Testar a API

### 1. Registrar Dado de Clima
```bash
curl -X POST http://localhost:3000/weather/logs \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25,
    "windspeed": 10,
    "winddirection": 180,
    "city": "São Paulo",
    "timestamp": "2024-11-22T18:00:00Z"
  }'
```

### 2. Listar Dados
```bash
curl http://localhost:3000/weather/logs
```

### 3. Exportar CSV
```bash
curl http://localhost:3000/weather/export.csv -o weather.csv
```

### 4. Exportar XLSX
```bash
curl http://localhost:3000/weather/export.xlsx -o weather.xlsx
```

### 5. Ver Insights
```bash
curl http://localhost:3000/weather/insights
```

---

## Estrutura

```
clima-ai-platform/
├── api-nest/              ← NestJS (3000)
├── frontend/              ← React (5173)
├── collector-python/      ← Python scheduler
├── worker-go/             ← Go consumer
├── docker-compose.yml     ← Orquestração
└── setup.sh              ← Automação
```

---

## Desenvolvimento

### Frontend Dev
```bash
cd frontend
npm run dev
# Acessar: http://localhost:5173
```

### API Dev
```bash
cd api-nest
npm run start:dev
# Acessar: http://localhost:3000
```

### Collector Local
```bash
cd collector-python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/main.py
```

### Worker Local
```bash
cd worker-go
go run main.go
```

---

## Verificação Rápida

```bash
# Status dos containers
docker-compose ps

# Logs da API
docker-compose logs -f api

# Logs do Collector
docker-compose logs -f collector

# Logs do Worker
docker-compose logs -f worker

# Parar tudo
docker-compose down
```

---

## Troubleshooting

### Erro: Port em uso
```bash
# Ver o que está usando a porta
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### Erro: Docker não rodando
```bash
# macOS
open /Applications/Docker.app
```

### Erro: Conexão recusada
```bash
# Aguardar que containers iniciem
sleep 10

# Verificar se estão rodando
docker-compose ps
```

---

## Monitoramento

### RabbitMQ
- Acessar: http://localhost:15672
- Usuário: guest
- Senha: guest
- Verificar: Queues > weather.raw

### MongoDB
```bash
mongosh mongodb://localhost:27017/clima_db
> db.weather.find().limit(1)
```

### Docker Stats
```bash
docker stats
```

---

## Documentação Completa

- README.md - Documentação detalhada
- VERIFICATION.md - Testes e verificação
- PROJECT_COMPLETION.md - Status completo
- EXECUTIVE_SUMMARY.md - Resumo executivo

---

## Próximos Passos

1. Plataforma em execução
2. Registrar dados de clima
3. Visualizar dashboard
4. Exportar relatórios
5. Configurar autenticação
6. Adicionar mais cidades

---

## Suporte Rápido

**Tudo quebrou?**
```bash
docker-compose down
docker-compose up -d --build
sleep 30
# Deve funcionar!
```

**Quer limpar tudo?**
```bash
docker-compose down -v
# Todos os dados serão apagados!
```

---

**Status:** 100% Operacional  
**Última Atualização:** 22/11/2024

