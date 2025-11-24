FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine
RUN npm install -g serve

WORKDIR /app
COPY --from=0 /app/dist .

EXPOSE 5173

CMD ["serve", "-s", ".", "-l", "5173"]
