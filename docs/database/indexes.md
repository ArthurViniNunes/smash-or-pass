# Estratégia de Indexação

## User

- email (UNIQUE)
- username (UNIQUE)

## Recipe

- status
- authorId
- createdAt

## RecipeInteraction

- userId
- recipeId
- type
- createdAt

## Comment

- recipeId
- userId
