# Database

## Principais Entidades

User
Recipe
Comment
RecipeInteraction
Category
Ingredient
Allergen
DietPreference

## Relacionamentos

User 1:N Recipe

User 1:N Comment

User 1:N RecipeInteraction

Recipe N:N Category

Recipe N:N DietPreference

Recipe N:N Ingredient

Ingredient N:N Allergen

User N:N Allergen

User N:N DietPreference
