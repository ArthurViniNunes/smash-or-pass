# Gerenciamento de Perfil e Preferências do Usuário

Este módulo centraliza o gerenciamento do perfil do usuário autenticado, englobando suas informações cadastrais básicas, suas restrições alérgicas e suas preferências dietéticas. As configurações estabelecidas aqui moldam diretamente o comportamento dos algoritmos de recomendação e busca de receitas da plataforma.

---

## Objetivos do Módulo

- Permitir a atualização cadastral (nome, biografia e avatar) do usuário logado de forma segura.
- Oferecer uma interface unificada para listagem e atualização em lote (bulk update) de alergênicos e preferências alimentares associados ao perfil.
- Garantir que todas as operações sejam estritamente isoladas no escopo do usuário detentor do token de acesso (`/me`).

---

## Fluxos Suportados

1. **Manutenção Cadastral**: O usuário modifica seus dados de exibição pública na plataforma (nome, bio e imagem de perfil).
2. **Sincronização de Alergias**: O usuário atualiza em uma única operação toda a sua lista de restrições a ingredientes nocivos.
3. **Ajuste de Estilo Alimentar**: O usuário atualiza em bloco suas preferências de dieta para recalibrar o feed de receitas.

---

## Regras de Autorização

Todas as rotas mapeadas neste roteador exigem obrigatoriamente a passagem do token JWT através do `authMiddleware`. As ações afetam exclusivamente o registro do usuário autenticado:

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Atualizar perfil cadastral | PATCH | `/users/me` | Sim | Qualquer Usuário |
| Listar alergênicos salvos | GET | `/users/me/allergens` | Sim | Qualquer Usuário |
| Atualizar lote de alergênicos | PUT | `/users/me/allergens` | Sim | Qualquer Usuário |
| Listar preferências salvas | GET | `/users/me/diet-preferences` | Sim | Qualquer Usuário |
| Atualizar lote de preferências | PUT | `/users/me/diet-preferences` | Sim | Qualquer Usuário |

---

## Endpoints e DTOs

### 1. Atualizar perfil do usuário autenticado

Modifica parcialmente os dados de perfil do usuário ativo.

- **URL**: `/users/me`
- **Método**: PATCH
- **Segurança**: Bearer Auth Token
- **Content-Type**: multipart/form-data

**Corpo da Requisição (Request Body):**

O endpoint aceita dois tipos de dados:

#### Campos JSON (textuais)
- name (string, min 3 chars)
- bio (string, max 500 chars)

#### Arquivo (opcional)
- avatar (file)

O arquivo enviado em `avatar` será processado pelo sistema de upload e armazenado automaticamente.

> Nota: name deve ter no mínimo 3 caracteres e bio no máximo 500 caracteres.

#### Resposta de Sucesso (200 OK)´

```json
{
  "id": "cm1q2w3e4r5t6y7u8i9o0p",
  "name": "Arthur Nunes",
  "username": "arthur_nunes",
  "email": "arthur@example.com",
  "role": "USER",
  "avatarUrl": "/uploads/avatars/avatar-123456.png",
  "bio": "Desenvolvedor apaixonado por produto e UI."
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token ausente ou inválido.
- 404 Not Found: Usuário correspondente ao token não localizado na base.

### 2. Listar alergênicos do usuário autenticado

Retorna todos os registros de abordagem alérgica ativamente vinculados à conta.

- **URL**: `/users/me/allergens`
- **Método**: GET

- **Segurança**: Bearer Auth Token

**Resposta de Sucesso (200 OK):**

```json
[
  {
    "userId": "cm1q2w3e4r5t6y7u8i9o0p",
    "allergenId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "allergen": {
      "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
      "name": "Amendoim"
    }
  }
]
```

### 3. Atualizar alergênicos do usuário autenticado (Lote)

Substitui integralmente a lista de alergênicos associados ao usuário pelos novos IDs informados.

- **URL**: `/users/me/allergens`
- **Método**: PUT
- **Segurança**: Bearer Auth Token

**Corpo da Requisição (Request Body):**

```json
{
  "allergenIds": [
    "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "9a2f4c1d-63f0-4d1a-8d66-4a8f7e2b4567"
  ]
}
```

**Resposta de Sucesso (200 OK):**

```json
[
  {
    "userId": "cm1q2w3e4r5t6y7u8i9o0p",
    "allergenId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "allergen": {
      "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
      "name": "Amendoim"
    }
  }
]
```

### 4. Listar preferências alimentares do usuário autenticado

Retorna a coleção de dietas e diretrizes alimentares salvas no perfil.

- **URL**: `/users/me/diet-preferences`
- **Método**: GET
- **Segurança**: Bearer Auth Token

**Resposta de Sucesso (200 OK):**

```json
[
  {
    "userId": "cm1q2w3e4r5t6y7u8i9o0p",
    "dietPreferenceId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "dietPreference": {
      "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
      "name": "Vegana"
    }
  }
]
```

### 5. Atualizar preferências alimentares do usuário autenticado (Lote)

Substitui integralmente a lista de preferências alimentares vinculadas ao perfil do usuário.

- **URL**: `/users/me/diet-preferences`
- **Método**: PUT
- **Segurança**: Bearer Auth Token

**Corpo da Requisição (Request Body):**

```json
{
  "dietPreferenceIds": [
    "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123"
  ]
}
```

**Resposta de Sucesso (200 OK):**

```json
[
  {
    "userId": "cm1q2w3e4r5t6y7u8i9o0p",
    "dietPreferenceId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "dietPreference": {
      "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
      "name": "Vegana"
    }
  }
]
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token de acesso ausente, inválido ou expirado.
- 400 Bad Request: Formato de payload inválido ou IDs fora do padrão UUID.
