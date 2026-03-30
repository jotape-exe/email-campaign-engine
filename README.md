# 📧 Email Campaign Engine

A template backend system is designed for managing and sending email campaigns. It uses a **Clean Architecture** approach and relies on **RabbitMQ** for reliable, asynchronous email processing.

---

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** (API Framework)
- **Knex.js** (Query Builder & Migrations)
- **PostgreSQL** (Database)
- **RabbitMQ** (Message Broker)
- **Zod** (Validation)
- **Pino** (Logging)
- **Day.js** (Date manipulation)

---

## 🏗️ Arquitetura do Projeto

O projeto segue os princípios da **Clean Architecture**, organizado da seguinte forma:

```text
src/
├── application/      # Casos de uso e orquestração da lógica de negócio.
├── config/           # Configurações globais (env, constants, etc).
├── domain/           # Entidades, regras de negócio puras e interfaces de repositório.
├── infrastructure/   # Implementações externas (Banco de Dados, RabbitMQ, Mailer).
├── interfaces/       # Controladores HTTP, Rotas e validadores.
├── main/             # Composição da aplicação (DI) e pontos de entrada (server/worker).
└── shared/           # Utilitários compartilhados, erros customizados e tipos globais.
```

---

## 🛠️ Comandos Úteis

### Desenvolvimento

- `npm run dev`: Inicia a API Express em modo watch (recarrega ao salvar).
- `npm run worker`: Inicia o worker principal do RabbitMQ para processamento de filas.
- `npm run worker:email`: Inicia especificamente o worker de envio de emails.

### Banco de Dados (Migrations)

- `npm run migrate:latest`: Executa todas as migrações pendentes.
- `npm run migrate:make <nome-da-migration>`: Cria um novo arquivo de migracão TypeScript.

### Outros

- `npm run build`: Compila o projeto TypeScript para JavaScript na pasta `dist`.
- `npm run start`: Inicia o servidor a partir da build compilada.
- `npm run generate:use-case`: Script auxiliar para gerar scaffold de novos Use Cases.

---

## 🚦 Como Iniciar

### 1. Pré-requisitos
- Node.js 20+
- Docker & Docker Compose (para o RabbitMQ)
- Instância do PostgreSQL rodando

### 2. Instalação
```bash
npm install
```

### 3. Configuração
Copia o arquivo de exemplo e ajuste as variáveis:
```bash
cp .env.example .env
```

### 4. Infraestrutura
Inicie o RabbitMQ via Docker:
```bash
docker-compose up -d
```

### 5. Banco de Dados
Rode as migrações para criar as tabelas:
```bash
npm run migrate:latest
```

### 6. Execução
Para rodar a API:
```bash
npm run dev
```

Para rodar o worker (em outro terminal):
```bash
npm run worker
```

---

## 📬 Mensageria (RabbitMQ)

O sistema utiliza os seguintes padrões:
- **DLX (Dead Letter Exchange)**: Para lidar com mensagens que falharam após retentativas.
- **Retentativas**: Implementado com atrasos (ex: 5 segundos) antes de reenviar para a fila principal.
- **Queues**: `email_campaign_queue`, `email_campaign_retry_queue`, `email_campaign_dlx_queue`.
