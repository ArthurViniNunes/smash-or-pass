# Smash or Pass

v#### Video Demo: https://youtu.be/u6gNtyVILso

![HomePage](docs/home-image.png)

## 📌 Descrição

O **Smash or Pass** é uma aplicação web inspirada no modelo de interação do Tinder, aplicada ao domínio culinário.

A plataforma permite que usuários descubram novas receitas por meio de interações simples de interesse (**Smash**) ou desinteresse (**Pass**), além de possibilitar o cadastro, gerenciamento e compartilhamento de receitas próprias.

O projeto foi desenvolvido como trabalho final da disciplina de Desenvolvimento de Software para Web, aplicando conceitos de:

- Arquitetura Cliente-Servidor
- APIs REST
- Autenticação e Autorização
- Persistência de Dados
- Documentação de Software
- Desenvolvimento Full Stack

---

## 🎯 Objetivo

Desenvolver uma aplicação web completa composta por frontend, backend e banco de dados, demonstrando boas práticas de desenvolvimento e documentação de software.

---

## ⚙️ Principais Funcionalidades

### 🔐 Autenticação

- Cadastro de usuários
- Login com JWT
- Controle de acesso por papéis (RBAC)

### 🍽️ Receitas

- Cadastro de receitas
- Edição de receitas próprias
- Exclusão de receitas próprias
- Upload de imagens
- Moderação de conteúdo

### 🔥 Smash or Pass

- Curtir receitas (Smash)
- Rejeitar receitas (Pass)
- Desfazer última interação
- Priorização de receitas ainda não avaliadas

### 💬 Comentários

- Criação de comentários
- Edição de comentários próprios
- Exclusão de comentários próprios

### 🏷️ Catálogo

- Categorias
- Ingredientes
- Preferências alimentares
- Alergênicos

### 🛠️ Administração

- Aprovação de receitas
- Aprovação de ingredientes
- Aprovação de categorias
- Dashboard administrativo

---

## 📚 Documentação

Toda a documentação do projeto encontra-se na pasta `docs/`.

### Arquitetura

| Documento                             | Descrição                      |
|---------------------------------------|--------------------------------|
| `docs/architecture/erd.md`            | Modelo entidade-relacionamento |
| `docs/architecture/business-rules.md` | Regras de negócio              |
| `docs/architecture/enums.md`          | Enums do sistema               |
| `docs/architecture/conventions.md`    | Convenções arquiteturais       |

### Banco de Dados

| Documento                        | Descrição                              |
|----------------------------------|----------------------------------------|
| `docs/database/prisma-schema.md` | Estrutura do banco e mapeamento Prisma |
| `docs/database/indexes.md`       | Índices e otimizações                  |

### API

| Documento                    | Descrição                  |
|------------------------------|----------------------------|
| `docs/api/authentication.md` | Autenticação e autorização |
| `docs/api/users.md`          | Endpoints de usuários      |
| `docs/api/recipes.md`        | Endpoints de receitas      |
| `docs/api/interactions.md`   | Endpoints de Smash/Pass    |
| `docs/api/comments.md`       | Endpoints de comentários   |
| `docs/api/moderation.md`     | Endpoints administrativos  |
| `docs/api/dashboard.md`      | Dashboard e métricas       |

---

## 🧱 Arquitetura

O sistema segue o modelo **Cliente-Servidor**, dividido em duas aplicações independentes.

**Backend:**

Tecnologias principais:

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Swagger/OpenAPI

Arquitetura em camadas:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

**Frontend:**

Tecnologias:

- React
- TypeScript
- Axios
- React Router

Arquitetura baseada em componentes reutilizáveis.

---

## 🛠️ Tecnologias Utilizadas

**Backend:**

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Swagger/OpenAPI

**Backend:**

- React
- TypeScript
- Axios

### Ferramentas

- Git
- GitHub
- Trello
- Excalidraw

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js
- PostgreSQL

---

**Backend:**

```bash
cd backend

npm install

npx prisma migrate dev

npx prisma db seed

npm run dev
```

Backend disponível em:

```text
http://localhost:3000
```

Swagger disponível em:

```text
http://localhost:3000/docs
```

---

**Frontend:**

```bash
cd frontend

npm install

npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```text
smash-or-pass/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── validations/
│   │   ├── utils/
│   │   └── config/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   └── routes/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── database/
│
└── README.md
```

---

## 📊 Status do Projeto

**Em desenvolvimento.**

---

## 👨‍💻 Equipe

- [Arthur Vinicius Carneiro Nunes](https://github.com/ArthurViniNunes)
- [João Igor Almeida Gomes](https://github.com/Igoxrx)
- [Marcos Antonio Alencar da Rocha Junior](https://github.com/mirkojr)
- [Samyra Vitória Lima de Almeida](https://github.com/samyraalmeida)

---

## 🤝 Contribuição

Antes de realizar alterações no projeto, consulte:

- `CONTRIBUTING.md`

---

## 📄 Licença

Este projeto está licenciado sob a [licença MIT](LICENSE).

## Trabalho 2 — Docker Compose

Consulte o [guia de desenvolvimento com Docker Compose](docs/docker-compose.md) para entender os serviços, as variáveis e o diagnóstico da stack.

O Compose executa Nginx, frontend, backend, worker de imagens, PostgreSQL 16,
MinIO e RabbitMQ. O backend aplica as migrations do Prisma na inicialização.
Backend e worker compartilham a imagem do Dockerfile em `backend/`. O frontend
tem seu próprio Dockerfile. A imagem do MinIO é compilada de revisões fixadas do servidor e do cliente oficiais no primeiro build.

1. Instale Docker com Compose v2 e clone o projeto.

   ```sh
   git clone https://github.com/ArthurViniNunes/smash-or-pass.git
   cd smash-or-pass
   cp .env.compose.example .env.compose
   ```

   No PowerShell, use `Copy-Item .env.compose.example .env.compose`.

2. Confira o DynamoDB na conta e região indicadas em `.env.compose`. Use a
   tabela existente ou, se ela tiver sido removida, crie uma com chave de
   partição `id` do tipo String. Com a AWS CLI autenticada, use:

   ```sh
   aws dynamodb create-table --region us-east-1 --table-name smash-or-pass-audit --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST
   aws dynamodb wait table-exists --region us-east-1 --table-name smash-or-pass-audit
   ```

   Preencha `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` em `.env.compose`,
   e `AWS_SESSION_TOKEN` se as credenciais forem temporárias. A aplicação
   precisa de `dynamodb:PutItem` na tabela. A identidade usada para conferir
   os registros precisa de `dynamodb:Scan`. O arquivo com as credenciais
   fica fora do Git.

3. Suba a stack e acesse http://localhost. Para rodar em outro endereço,
   ajuste `CORS_ORIGINS` para a origem pública. Se trocar as senhas do
   PostgreSQL e do RabbitMQ, atualize também as URLs correspondentes.
   Use senhas de desenvolvimento apenas na execução local.

   ```sh
   docker compose --env-file .env.compose up --build -d
   docker compose --env-file .env.compose ps -a
   curl http://localhost/health
   ```

4. Para preencher um banco novo com categorias, ingredientes e dados de
   demonstração, defina `SEED_PASSWORD` e rode o seed uma vez. O seed apaga os
   dados existentes antes de inserir os exemplos.

   ```sh
   docker compose --env-file .env.compose exec backend npx prisma db seed
   ```

### Verificação para a entrega

- Cadastre um usuário e publique uma receita com imagem. Abra a receita
  novamente e confirme que o navegador recebe a imagem em `/api/media/`.
  O Nginx encaminha a leitura ao MinIO e o backend envia a imagem para o
  bucket `recipe-images`.
- Confira o processamento da imagem e as filas.

  ```sh
  docker compose --env-file .env.compose logs image-worker
  docker compose --env-file .env.compose exec rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged
  ```

  O worker confirma a mensagem após gravar a imagem processada no MinIO.
  Falhas repetidas são encaminhadas à fila `image-processing-failed`.

- Consulte os registros de auditoria das operações no DynamoDB.

  ```sh
  aws dynamodb scan --region us-east-1 --table-name smash-or-pass-audit --max-items 5
  ```

- Pare e suba os containers novamente para confirmar a persistência da
  receita e da imagem. O Compose usa volumes para PostgreSQL, MinIO e RabbitMQ.

  ```sh
  docker compose --env-file .env.compose down
  docker compose --env-file .env.compose up -d
  ```

O PostgreSQL começa com o esquema das migrations. Uma restauração de dados
do RDS e a cópia de objetos antigos do S3 exigem backups desses recursos.
A arquitetura do Trabalho 1 está registrada em
[Arquitetura AWS](docs/aws-services-architecture.md).
