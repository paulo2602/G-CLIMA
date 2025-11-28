# 🎥 SCRIPT DE VÍDEO - GDASH CLIMA (5 minutos)
## O QUE VOCÊ PRECISA FALAR (Pronto para ler!)

---

## 📌 **INTRO (0:00 - 0:30)** - 30 segundos

"Olá! Eu sou [Seu Nome]. Essa é a GDASH CLIMA, uma plataforma 
de coleta e análise de dados climáticos em tempo real. 

6 containers Docker trabalhando juntos para coletar, processar 
e visualizar dados. Vou mostrar como tudo funciona!"

---

## 🏗️ **ARQUITETURA (0:30 - 1:15)** - 45 segundos

"Temos 6 serviços rodando em containers Docker:

FRONTEND - React + Vite na porta 5173. Aqui o usuário interage 
com a plataforma, vê dados em tempo real.

API - NestJS na porta 3000. Recebe requisições, autentica com JWT,
valida dados e salva no banco.

MONGODB - Banco de dados na porta 27017. Armazena todos os 
registros climáticos.

RABBITMQ - Message Broker na porta 5672. Fila de mensagens entre 
o Collector e o Worker. Garante que nenhum dado seja perdido.

COLLECTOR - Python. Roda continuamente, coleta dados da API 
OpenWeather a cada 60 minutos.

WORKER - Go. Consumer de mensagens. Escuta a fila RabbitMQ 
e envia dados para a API."

---

## 🔄 **PIPELINE DE DADOS (1:15 - 3:15)** - 2 minutos

### **1. Python Collector (30s)**

"Aqui você vê os logs do Collector Python. A cada 60 minutos,
ele faz uma requisição HTTP para a API OpenWeather.

Passa as coordenadas de São Paulo: latitude -23.5505, longitude -46.6333.

Recebe: temperatura, umidade, pressão, velocidade do vento.

Depois publica tudo em uma fila RabbitMQ chamada 'weather.raw'."

---

### **2. RabbitMQ (30s)**

"Aqui no RabbitMQ você vê o painel de administração.

Vou clicar em 'Queues' para ver as filas.

Aqui está 'weather.raw' - essa é a fila onde o Collector publica 
as mensagens climáticas.

A fila é DURÁVEL. Isso significa que se o sistema cair agora, 
quando subir novamente, as mensagens continuam aqui esperando 
para serem processadas. Dados não são perdidos."

---

### **3. Worker Go (30s)**

"Aqui estão os logs do Worker Go. 

Você vê: 'Mensagem recebida: {...dados climáticos...}'

Quando uma mensagem chega na fila, o Worker consome e faz um 
POST HTTP para a API em /weather/logs.

Depois: 'Enviado para API com sucesso'

Se der erro, o Worker tenta novamente automaticamente. 
É um consumer confiável."

---

### **4. API NestJS (30s)**

"Aqui está o código da API NestJS. A função 'collectWeatherByCity' 
recebe os dados do Worker.

Vou mostrar as linhas 60-95. Aqui você vê:

1. A API valida os dados com Class Validator
2. Calcula a probabilidade de chuva baseado no weather code
3. Cria um objeto weatherLog com todos os dados

Depois chama 'this.create(weatherLog)' que salva no MongoDB."

---

### **5. MongoDB (30s)**

"Aqui estou no MongoDB. Executo uma query para ver um documento 
climático salvo.

Você vê: temperatura, umidade, pressão, descrição do clima, 
cidade, timestamp, e probabilidade de chuva.

Todos os registros estão aqui, persistidos e organizados.

Esse documento é recuperado pelo Frontend para renderizar 
no Dashboard."

---

### **6. Frontend (30s)**

"Aqui voltamos ao Frontend. 

O Dashboard faz GET /weather/logs, recebe todos os documentos 
do MongoDB e renderiza em cards lindos.

Cada card mostra: temperatura, ícone do clima, probabilidade 
de chuva em cores, umidade, velocidade do vento, pressão.

Tudo em tempo real. Dark mode incluído e funcionando."

---

## 🤖 **IA - INSIGHTS (3:15 - 4:15)** - 1 minuto

### **Parte 1 - Probabilidade de Chuva (30s)**

"Aqui está a inteligência artificial do projeto - Parte 1.

Mapeamos 66 codes diferentes da OpenWeather para probabilidade 
de chuva.

Você vê:
- Código 800 = Céu limpo = 0% de chuva
- Código 802 = Nuvens dispersas = 25% de chuva
- Código 500 = Chuva leve = 30% de chuva
- Código 501 = Chuva moderada = 50% de chuva
- Código 504 = Chuva extrema = 95% de chuva

No Frontend, isso é renderizado com cores:
Verde (0-30%), Amarelo (30-60%), Laranja (60-80%), Vermelho (80%+)"

---

### **Parte 2 - Análise de Temperatura (30s)**

"Agora a Parte 2 da IA - Análise de Temperatura.

Aqui na página Explore, você vê os Insights.

A API analisa os últimos 48 registros de temperatura:

1. Calcula a TEMPERATURA MÉDIA
2. Classifica como FRIO (≤18°C), AGRADÁVEL (18-30°C), ou QUENTE (≥30°C)
3. Gera um RESUMO AUTOMÁTICO narrativo

Você vê os cards mostrando: Average Temperature, Max Temperature, 
Min Temperature, e Average Rain Probability.

Tudo calculado em tempo real quando você acessa o Explore!"

---

## 💡 **DECISÕES TÉCNICAS (4:15 - 4:45)** - 30 segundos

"Agora vou explicar as principais decisões técnicas.

TYPESCRIPT - Tudo é tipado. Frontend, API, tudo em TypeScript. 
Reduz bugs e melhora manutenibilidade.

NESTJS - Framework completo com injeção de dependência, módulos, 
guards, middlewares. Perfeito para uma API escalável.

REACT + VITE - Vite compila 10x mais rápido que Webpack. 
React é modular e reutilizável.

DOCKER COMPOSE - Cada serviço em seu próprio container. 
Fácil fazer scale, deploy, debugar.

RABBITMQ - Message Broker industria-standard. Confiável e durável.

GO - Linguagem compilada, performática, concorrência nativa. 
Ideal para processar mensagens.

PYTHON - Simples e legível para coleta de dados.

MONGODB - NoSQL, flexível, ótimo para séries temporais de sensores."

---

## 🎬 **DEMO AO VIVO (4:45 - 5:00)** - 15 segundos

"Com um único comando, a plataforma inteira sobe:
'docker-compose up -d'

Em 30 segundos, 6 containers rodando. Aqui você vê no docker-compose ps.

Abrindo em localhost:5173. Login admin/admin.

Dashboard com dados em tempo real. Cards com temperatura, umidade, 
pressão, chance de chuva. Dark mode funciona perfeitamente.

Explore page mostra os Insights.

Tudo rodando em Docker. Pronto para produção!

Se quiser ver o código: github.com/paulo2602/G-CLIMA

Obrigado!"
