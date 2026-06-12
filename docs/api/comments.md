# Interações e Comentários

Este módulo gerencia a seção de comentários das receitas na plataforma **Smash or Pass**. Ele permite o engajamento comunitário por meio de feedbacks em texto estruturado, garantindo que usuários leiam livremente, mas interajam sob controle restrito de identidade.

---

## Objetivos do Módulo

- Permitir que os usuários expressem suas opiniões e experiências sobre receitas específicas.
- Prover visualização aberta de feedbacks, incluindo informações de autoria (username e avatar).
- Controlar a integridade dos dados, limitando a edição e exclusão de comentários apenas aos seus respectivos autores.

---

## Fluxos Suportados

1. Leitura de Feedbacks: Fluxo público onde qualquer usuário obtém o histórico cronológico de comentários vinculados a uma receita específica.
2. Inserção de Comentários: Usuários autenticados submetem opiniões respeitando limites textuais específicos.
3. Modificação/Remoção de Conteúdo: Autores atualizam ou excluem seus feedbacks prévios quando necessário.

---

## Regras de Autorização

A API utiliza isolamento global a partir do middleware de autenticação nas rotas de alteração de estado:

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Listar comentários da receita | GET | /comments/recipe/:recipeId | Não | Público |
| Criar comentário | POST | /comments | Sim | Qualquer Usuário |
| Atualizar comentário | PATCH | /comments/:id | Sim | Autor do Item |
| Remover comentário | DELETE | /comments/:id | Sim | Autor do Item |

---

## Endpoints e DTOs

### 1. Listar comentários de uma receita

Retorna todos os comentários associados ao ID da receita informada na URL, injetando os dados de perfil do autor de cada mensagem.

- URL: /comments/recipe/:recipeId
- Método: GET
- Parâmetros de URL:
  - recipeId (string, uuid, obrigatório): ID da receita consultada.

Exemplo de resposta (200 OK):

```json
[
  {
    "id": "7d9e8f1b-5b54-4e0b-9b2e-5a7fd0a1d456",
    "content": "Ficou excelente.",
    "recipeId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "userId": "cm1q2w3e4r5t6y7u8i9o0p",
    "createdAt": "2026-06-12T01:10:00.000Z",
    "updatedAt": "2026-06-12T01:10:00.000Z",
    "user": {
      "id": "cm1q2w3e4r5t6y7u8i9o0p",
      "username": "artur_silva",
      "avatarUrl": null
    }
  }
]
```

---

### 2. Criar comentário

Insere um novo comentário para uma receita específica na base de dados.

- URL: /comments
- Método: POST
- Segurança: Bearer Auth Token (authMiddleware)

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| recipeId | string | Obrigatório, Formato UUID | Identificador da receita comentada. |
| content | string | Obrigatório, Min: 1, Max: 500 | Conteúdo textual da mensagem. |

Exemplo de requisição:

```json
{
  "recipeId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "content": "Ficou excelente."
}
```

#### Resposta de Sucesso (201 Created)

```json
{
  "id": "7d9e8f1b-5b54-4e0b-9b2e-5a7fd0a1d456",
  "content": "Ficou excelente.",
  "recipeId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "userId": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-12T01:10:00.000Z",
  "updatedAt": "2026-06-12T01:10:00.000Z"
}
```

#### Respostas de Erro Comuns

- 401 Unauthorized: Token de acesso ausente ou inválido.
- 404 Not Found: A receita informada pelo UUID não existe.

---

### 3. Atualizar comentário

Modifica o teor textual de um comentário preexistente criado pelo próprio usuário.

- URL: /comments/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): Identificador único do comentário.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| content | string | Obrigatório, Min: 1, Max: 500 | Novo texto atualizado da mensagem. |

Exemplo de requisição:

```json
{
  "content": "Atualizando o comentário."
}
```

#### Resposta de Sucesso (200 OK)

```json
{
  "id": "7d9e8f1b-5b54-4e0b-9b2e-5a7fd0a1d456",
  "content": "Atualizando o comentário.",
  "recipeId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "userId": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-12T01:10:00.000Z",
  "updatedAt": "2026-06-12T01:10:00.000Z"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token inválido ou ausente.
- 403 Forbidden: O usuário autenticado não é o autor do comentário.
- 404 Not Found: O ID do comentário não foi localizado.

---

### 4. Remover comentário

Exclui permanentemente um comentário específico do sistema.

- URL: /comments/:id
- Método: DELETE
- Segurança: Bearer Auth Token (authMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): Identificador único do comentário.

Exemplo de resposta (204 No Content):

*Sem corpo de resposta.*

**Respostas de Erro Comuns:**

- 401 Unauthorized: Usuário não identificado.
- 403 Forbidden: Tentativa de remoção de item pertencente a outro usuário.
- 404 Not Found: Comentário não encontrado na base.
