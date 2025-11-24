# Verificação de Funcionalidades

## 1. Containers Rodando

```bash
$ docker-compose ps
```

**Esperado:**
- clima_api (Up)
- clima_mongo (Up)
- clima_rabbitmq (Up)
- clima_collector (Up)
- clima_worker (Up)
- clima_frontend (Up)

## 2. API NestJS

### 2.1 Verificar se API está respondendo
```bash
$ curl http://localhost:3000/weather/logs
[]  # Resposta vazia (sem dados ainda)
```

### 2.2 Registrar novo dado de clima
```bash
$ curl -X POST http://localhost:3000/weather/logs \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 28.5,
    "windspeed": 12,
    "winddirection": 270,
    "city": "São Paulo",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

**Esperado:** 
```json
{
  "_id": "...",
  "temperature": 28.5,
  "windspeed": 12,
  "winddirection": 270,
  "city": "São Paulo",
  "timestamp": "2024-...",
  "createdAt": "2024-...",
  "updatedAt": "2024-...",
  "__v": 0
}
```

### 2.3 Listar dados
```bash
$ curl http://localhost:3000/weather/logs
```

**Esperado:** Array com registros

### 2.4 Exportar CSV
```bash
$ curl http://localhost:3000/weather/export.csv -o weather.csv
$ head weather.csv
```

**Esperado:** CSV com cabeçalhos e dados

### 2.5 Exportar XLSX
```bash
$ curl http://localhost:3000/weather/export.xlsx -o weather.xlsx
$ ls -lh weather.xlsx
```

**Esperado:** Arquivo XLSX criado

### 2.6 Insights
```bash
$ curl http://localhost:3000/weather/insights
```

**Esperado:**
```json
{
  "message": "Sem dados suficientes"
}
```
ou
```json
{
  "averageTemperature": "28.5",
  "label": "clima agradável",
  "summary": "Nos últimos N registros, a temperatura média foi de 28.5°C, indicando clima agradável."
}
```

## 3. RabbitMQ

### 3.1 Acessar Management UI
```
http://localhost:15672
Usuário: guest
Senha: guest
```

**Verificações:**
- Queues: Ver fila `weather.raw`
- Connections: Ver conexões ativas
- Channels: Ver canais

## 4. MongoDB

### 4.1 Conectar ao banco
```bash
$ mongosh mongodb://localhost:27017/clima_db
```

### 4.2 Listar coleções
```javascript
> show collections
# Esperado: weather, users
```

### 4.3 Ver documentos
```javascript
> db.weather.find().limit(2)
# Esperado: Documentos com temperature, windspeed, etc.
```

## 5. Frontend

### 5.1 Acessar dashboard
```
http://localhost:5173
```

**Verificações:**
- Página carrega (Vite dev server)
- Componentes React renderizam
- Network requests para API

## 6. Logs dos Serviços

### 6.1 Logs do Collector
```bash
$ docker-compose logs collector
```

**Esperado:** Mensagem de conexão RabbitMQ e coleta agendada

### 6.2 Logs do Worker
```bash
$ docker-compose logs worker
```

**Esperado:** Consumo de mensagens da fila

### 6.3 Logs da API
```bash
$ docker-compose logs api
```

**Esperado:** "Nest application successfully started on port 3000"

## 7. Testes de Integração

### 7.1 Fluxo Completo
```bash
# 1. Aguardar que collector publique mensagem (até 60 min)
# OU forçar coleta manualmente:

docker-compose exec collector python -c "
from app.main import get_weather, send_to_queue
import json
data = get_weather()
send_to_queue(json.dumps(data))
print('Mensagem enviada!')
"

# 2. Verificar fila RabbitMQ Management (http://localhost:15672)
# Deverá ter 1 mensagem na fila weather.raw

# 3. Verificar logs do worker
docker-compose logs -f worker

# 4. Verificar dados no MongoDB
mongosh mongodb://localhost:27017/clima_db
> db.weather.find().limit(1)

# 5. Verificar na API
curl http://localhost:3000/weather/logs
```

## 8. Health Checks

### 8.1 MongoDB
```bash
$ docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

**Esperado:** `{ ok: 1 }`

### 8.2 RabbitMQ
```bash
$ curl http://localhost:15672/api/aliveness-test/
```

**Esperado:** HTTP 200

### 8.3 API
```bash
$ curl http://localhost:3000/weather/logs
```

**Esperado:** HTTP 200, JSON array

## 9. Performance

### 9.1 Verificar uso de memória
```bash
$ docker stats
```

**Esperado:**
- mongo: ~100-200 MB
- rabbitmq: ~100-150 MB
- api: ~50-100 MB
- frontend: ~20-50 MB
- collector: ~20-50 MB
- worker: ~10-20 MB

## 10. Verificação de Portas

```bash
$ lsof -i :3000    # API
$ lsof -i :5173    # Frontend
$ lsof -i :27017   # MongoDB
$ lsof -i :5672    # RabbitMQ
$ lsof -i :15672   # RabbitMQ Management
```

**Esperado:** Todas as portas em LISTEN

---

## Checklist Final

- [ ] API respondendo em http://localhost:3000
- [ ] Frontend carregando em http://localhost:5173
- [ ] RabbitMQ acessível em http://localhost:15672
- [ ] MongoDB conectável via mongosh
- [ ] Dados podem ser registrados via POST
- [ ] Dados podem ser listados via GET
- [ ] Exportação CSV funciona
- [ ] Exportação XLSX funciona
- [ ] Collector está rodando
- [ ] Worker está rodando
- [ ] Não há erros nos logs

**Status: TUDO FUNCIONANDO**

