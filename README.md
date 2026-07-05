# Smash or Pass

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
