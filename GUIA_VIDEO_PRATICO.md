# 📺 GUIA PRÁTICO - O QUE MOSTRAR NA TELA

## ✅ PREPARAÇÃO INICIAL (Fazer ANTES de gravar)

```bash
# Terminal 1 - Inicie Docker Compose
docker-compose up -d

# Aguarde ~30 segundos
sleep 30

# Verifique se tudo subiu
docker-compose ps
```

Você deve ver 6 containers com status **UP**:
- mongo
- rabbitmq
- api
- frontend
- collector-python
- worker-go

---

## 📹 O QUE MOSTRAR - PASSO A PASSO

### **INTRO (0:00 - 0:30)**
- [ ] Abrir Dashboard em `http://localhost:5173`
- [ ] Mostrar a página inicial com cards de cidades
- [ ] Fazer scroll para mostrar vários cards

---

### **ARQUITETURA (0:30 - 1:15)**

**Abrir Terminal e executar:**
```bash
docker-compose ps
```

**Mostrar na tela:** A lista de 6 containers rodando

---

### **PIPELINE DE DADOS (1:15 - 3:15)**

#### **1. Python Collector (30s)**
**Terminal:**
```bash
docker-compose logs collector | tail -20
```
**Mostrar:** Logs do collector mostrando requisições e publicações

#### **2. RabbitMQ (30s)**
**Browser - Abra:**
```
http://localhost:15672
```
**Login:** guest / guest

**Mostrar:** 
- Aba "Queues"
- Fila "weather.raw"
- Número de mensagens

#### **3. Worker Go (30s)**
**Terminal:**
```bash
docker-compose logs worker | tail -20
```
**Mostrar:** Logs do worker consumindo mensagens

#### **4. API NestJS (30s)**
**Abrir VS Code:**
- Arquivo: `api-nest/src/weather/weather.service.ts`
- Scroll até linhas 70-95 (função `collectWeatherByCity`)
- **Mostrar:** Onde salva no MongoDB

#### **5. MongoDB (30s)**
**Terminal:**
```bash
mongosh mongodb://localhost:27017/clima_db
db.weather.find().limit(1).pretty()
```
**Mostrar:** Um documento com temperatura, umidade, pressão

#### **6. Frontend (30s)**
**Browser:**
```
http://localhost:5173
```
**Mostrar:** Dashboard com dados carregados em cards

---

### **IA - INSIGHTS (3:15 - 4:15)**

#### **Parte 1 - Códigos de Chuva (30s)**
**Abrir VS Code:**
- Arquivo: `api-nest/src/weather/weather-utils.ts`
- Scroll e mostre os primeiros 20-30 codes do mapa
- **Destaque:** 
  - Código 800 = 0%
  - Código 500 = 30%
  - Código 504 = 95%

#### **Parte 2 - Análise de Temperatura (30s)**
**Browser - Dashboard:**
```
http://localhost:5173
```
- Clique em "Explore"
- **Mostrar:** Cards com:
  - "Average Temperature"
  - "Max Temperature"
  - "Min Temperature"
  - "Average Rain Probability"

---

### **DECISÕES TÉCNICAS (4:15 - 4:45)**

**Abrir VS Code e mostre:**
- [ ] `package.json` (frontend) - linha 1-5
- [ ] `api-nest/package.json` - linha 1-5
- [ ] `docker-compose.yml` - toda estrutura

Ou simplesmente **leia o roteiro** enquanto mostra os arquivos abertos.

---

### **DEMO (4:45 - 5:00)**

**Terminal - Execute:**
```bash
docker-compose ps
```

**Browser:**
- Abra `http://localhost:5173`
- Faça login: `admin` / `admin`
- Mostre Dashboard
- Toggle dark mode (canto superior direito)
- Acesse Explore page
- Mostre Insights

---

## 🎥 RESUMO DE COMANDOS (Copie e Cole)

```bash
# Inicia tudo
docker-compose up -d

# Verifica containers
docker-compose ps

# Logs do Collector
docker-compose logs collector | tail -20

# Logs do Worker
docker-compose logs worker | tail -20

# Acessa MongoDB
mongosh mongodb://localhost:27017/clima_db
db.weather.find().limit(1).pretty()
```

---

## 🌐 URLs PARA BOOKMARK

```
Frontend:    http://localhost:5173
API:         http://localhost:3000
RabbitMQ:    http://localhost:15672 (guest/guest)
MongoDB:     localhost:27017
```

---

## 📋 CHECKLIST DE TELA

- [ ] Terminal visível e com boa fonte
- [ ] VS Code com theme claro
- [ ] Browser com zoom 110-125%
- [ ] Docker rodando sem erros
- [ ] Frontend carregando dados
- [ ] RabbitMQ acessível
- [ ] MongoDB com dados

---

## ⚡ DICA: Se algo não funcionar

```bash
# Reiniciar tudo
docker-compose down
docker-compose up -d
sleep 30
docker-compose ps
```

Pronto para gravar! 🎬
