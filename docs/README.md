# Documentação do Projeto

Este diretório concentra toda a documentação técnica do projeto **Smash or Pass**.

A documentação está organizada por domínio para facilitar manutenção, navegação e evolução do sistema.

**Domínios:**

- [Estrutura da Documentação](#estrutura-da-documentação)
- [Arquitetura](#arquitetura)
- [API](#api)
- [Banco de Dados](#banco-de-dados)
- [Fonte da Verdade](#fonte-da-verdade)
- [Tecnologias Relacionadas](#tecnologias-relacionadas)
- [Objetivo da Documentação](#objetivo-da-documentação)
- [Atualização da Documentação](#atualização-da-documentação)

---

## Estrutura da Documentação

```text
docs/
├── README.md
│
├── architecture/
│   ├── business-rules.md
│   ├── conventions.md
│   ├── decision-log.md
│   ├── enums.md
│   └── erd.md
│
├── api/
│   ├── allergens.md
│   ├── authentication.md
│   ├── categories.md
│   ├── comments.md
│   ├── dashboard.md
│   ├── diet-preferences.md
│   ├── ingredients.md
│   ├── moderation.md
│   ├── recipe-interactions.md
│   ├── recipes.md
│   ├── user-allergens.md
│   ├── users-diet-preferences.md
│   └── users.md
│
└── database/
    ├── prisma-schema.md
    ├── indexes.md
    └── README.md
```

---

## Arquitetura

Documentação relacionada à modelagem e às regras fundamentais do sistema.

| Documento                        | Descrição                                                  |
| -------------------------------- | ---------------------------------------------------------- |
| `architecture/business-rules.md` | Regras de negócio utilizadas pelo backend e frontend.      |
| `architecture/conventions.md`    | Convenções arquiteturais, padrões e diretrizes do projeto. |
| `architecture/decision-log.md`   | Registro das decisões arquiteturais (ADR).                 |
| `architecture/enums.md`          | Catálogo centralizado de enums do sistema.                 |
| `architecture/erd.md`            | Modelo Entidade-Relacionamento (ERD) oficial do projeto.   |

---

## API

Documentação funcional da API REST.

Cada documento descreve:

- Objetivos do módulo
- Fluxos suportados
- Endpoints
- DTOs
- Regras de autorização
- Exemplos de requisição e resposta

| Documento                       | Descrição                                            |
| ------------------------------- | ---------------------------------------------------- |
| `api/allergens.md`              | Gerenciamento de alérgenos e restrições alimentares. |
| `api/authentication.md`         | Cadastro, login e autenticação JWT.                  |
| `api/categories.md`             | Gerenciamento de categorias de receitas.             |
| `api/comments.md`               | Comentários em receitas.                             |
| `api/dashboard.md`              | Métricas administrativas e indicadores.              |
| `api/diet-preferences.md`       | Preferências dietéticas dos usuários.                |
| `api/ingredients.md`            | Gerenciamento de ingredientes.                       |
| `api/moderation.md`             | Aprovação e rejeição de conteúdo.                    |
| `api/recipe-interactions.md`    | Interações específicas de receitas.                  |
| `api/recipes.md`                | Cadastro, consulta, edição e remoção de receitas.    |
| `api/user-allergens.md`         | Gerenciamento de alérgenos dos usuários.             |
| `api/users-diet-preferences.md` | Preferências dietéticas dos usuários.                |
| `api/users.md`                  | Operações relacionadas aos usuários.                 |

---

## Banco de Dados

Documentação relacionada à persistência dos dados.

| Documento                   | Descrição                                        |
| --------------------------- | ------------------------------------------------ |
| `database/indexes.md`       | Estratégia de índices e otimizações de consulta. |
| `database/prisma-schema.md` | Mapeamento do modelo de dados para Prisma ORM.   |
| `database/README.md`        | Visão geral do banco de dados.                   |

---

## Fonte da Verdade

A ordem de precedência da documentação é:

```text
ERD
 ↓
Regras de Negócio
 ↓
Schema Prisma
 ↓
Swagger/OpenAPI
 ↓
Implementação
```

Caso exista divergência entre documentos, deve-se seguir a ordem acima.

---

## Tecnologias Relacionadas

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Swagger / OpenAPI

### Frontend

- React
- TypeScript
- Axios

---

## Objetivo da Documentação

A documentação tem como objetivo:

- Servir como referência única para desenvolvimento.
- Facilitar manutenção e evolução do sistema.
- Auxiliar na avaliação acadêmica do projeto.
- Reduzir inconsistências entre backend, frontend e banco de dados.
- Facilitar onboarding de novos membros da equipe.

---

## Atualização da Documentação  

Sempre que houver alteração em:

- Modelo de dados;
- Regras de negócio;
- Endpoints;
- Fluxos de autenticação;
- Estrutura do banco de dados;

a documentação correspondente deve ser atualizada antes da implementação ser considerada concluída.
