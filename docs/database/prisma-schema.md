# Prisma Schema

## Objetivo

Este documento descreve como o Modelo Entidade-Relacionamento (ERD) é mapeado para o banco de dados utilizando Prisma ORM.

A implementação efetiva encontra-se em:

```text
backend/prisma/schema.prisma
```

Este documento existe para facilitar manutenção, revisão e alinhamento entre modelagem, implementação e documentação da API.

---

## Banco de Dados

### SGBD

PostgreSQL

### ORM

Prisma ORM

### Estratégia de Chaves Primárias

Todas as entidades principais utilizam:

```prisma
id String @id @default(uuid())
```

Representando UUIDs gerados automaticamente.

---

## Entidades Principais

### User

Representa usuários da plataforma.

**Campos:**

| Campo        | Tipo     |
| ------------ | -------- |
| id           | UUID     |
| name         | String   |
| username     | String   |
| email        | String   |
| passwordHash | String   |
| avatarUrl    | String?  |
| bio          | String?  |
| createdAt    | DateTime |
| updatedAt    | DateTime |

**Restrições:**

- email único
- username único

**Relacionamentos:**

- User → UserAllergen
- User → UserDietPreference
- User → Recipe
- User → Comment
- User → RecipeInteraction

---

### Recipe

Representa receitas cadastradas pelos usuários.

**Campos:**

| Campo                  | Tipo             |
| ---------------------- | ---------------- |
| id                     | UUID             |
| title                  | String           |
| description            | String           |
| preparationMethod      | String           |
| preparationTimeMinutes | Integer          |
| difficulty             | Difficulty       |
| imageUrl               | String?          |
| status                 | ModerationStatus |
| authorId               | UUID             |
| createdAt              | DateTime         |
| updatedAt              | DateTime         |

**Relacionamentos:**

- Recipe → User
- Recipe → RecipeCategory
- Recipe → RecipeIngredient
- Recipe → RecipeDietPreference
- Recipe → Comment
- Recipe → RecipeInteraction

---

### Category

Representa categorias utilizadas pelas receitas.

**Campos:**

| Campo       | Tipo             |
| ----------- | ---------------- |
| id          | UUID             |
| name        | String           |
| status      | ModerationStatus |
| createdByid | UUID             |

**Relacionamentos:**

- Category → RecipeCategory

---

### Ingredient

Representa ingredientes aprovados ou pendentes.

**Campos:**

| Campo       | Tipo             |
| ----------- | ---------------- |
| id          | UUID             |
| name        | String           |
| status      | ModerationStatus |
| createdByid | UUID             |

**Relacionamentos:**

- Ingredient → RecipeIngredient
- Ingredient → IngredientAllergen

---

### Allergen

Representa alergênicos.

**Campos:**

| Campo | Tipo   |
| ----- | ------ |
| id    | UUID   |
| name  | String |

**Relacionamentos:**

- Allergen → UserAllergen
- Allergen → IngredientAllergen

---

### DietPreference

Representa preferências alimentares.

**Campos:**

| Campo | Tipo   |
| ----- | ------ |
| id    | UUID   |
| name  | String |

**Relacionamentos:**

- DietPreference → UserDietPreference
- DietPreference → RecipeDietPreference

---

### Comment

Comentários realizados pelos usuários.

**Campos:**

| Campo     | Tipo     |
| --------- | -------- |
| id        | UUID     |
| content   | String   |
| recipeId  | UUID     |
| userId    | UUID     |
| createdAt | DateTime |
| updatedAt | DateTime |

---

### RecipeInteraction

Representa ações Smash ou Pass.

**Campos:**

| Campo     | Tipo            |
| --------- | --------------- |
| id        | UUID            |
| recipeId  | UUID            |
| userId    | UUID            |
| type      | InteractionType |
| createdAt | DateTime        |

**Restrições:**

Um usuário pode possuir apenas uma interação por receita.

```prisma
@@unique([userId, recipeId])
```

---

## Tabelas de Relacionamento

### UserAllergen

Relacionamento N:N entre User e Allergen.

**Chave composta:**

```prisma
@@id([userId, allergenId])
```

---

### UserDietPreference

Relacionamento N:N entre User e DietPreference.

**Chave composta:**

```prisma
@@id([userId, dietPreferenceId])
```

---

### RecipeCategory

Relacionamento N:N entre Recipe e Category.

**Chave composta:**

```prisma
@@id([recipeId, categoryId])
```

---

### RecipeIngredient

Relacionamento N:N entre Recipe e Ingredient.

**Campos adicionais:**

| Campo    | Tipo    |
| -------- | ------- |
| quantity | Decimal |
| unit     | String  |

**Chave composta:**

```prisma
@@id([recipeId, ingredientId])
```

---

### IngredientAllergen

Relacionamento N:N entre Ingredient e Allergen.

**Chave composta:**

```prisma
@@id([ingredientId, allergenId])
```

---

### RecipeDietPreference

Relacionamento N:N entre Recipe e DietPreference.

**Chave composta:**

```prisma
@@id([recipeId, dietPreferenceId])
```

---

## Convenções Prisma

### Nomenclatura

#### Models

Utilizar PascalCase.

Exemplos:

```text
User
Recipe
RecipeInteraction
```

**Campos:**

Utilizar camelCase.

Exemplos:

```text
createdAt
updatedAt
passwordHash
preparationTimeMinutes
```

---

### Auditoria

Entidades principais devem possuir:

```prisma
createdAt DateTime @default(now())

updatedAt DateTime @updatedAt
```

---

### Exclusão

Não será utilizado Soft Delete na primeira versão do projeto.

Exclusões serão físicas (DELETE).
