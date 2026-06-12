# Gerenciamento de Alergênicos (api/allergens.md)

Este módulo centraliza o catálogo de alérgenos e restrições alimentares globais do sistema **Smash or Pass**. Ele serve de base para que os usuários configurem seus perfis e para que os ingredientes e receitas sejam devidamente validados e filtrados.

---

## Objetivos do Módulo

- Catalogar as substâncias e componentes alimentares que causam reações adversas ou restrições de consumo (ex: Glúten, Leite, Amendoim).
- Prover uma API pública de leitura para que o frontend alimente formulários e filtros.
- Garantir o controle restrito de escrita (criação, edição e exclusão) apenas para usuários com privilégios administrativos.

---

## Fluxos Suportados

1. Consulta Geral: Qualquer usuário da aplicação (autenticado ou não) pode listar ou buscar detalhes de um alérgeno cadastrado.
2. Manutenção de Cadastro: Administradores gerenciam a inclusão de novos alérgenos ou corrigem nomes existentes conforme regras de padronização.

---

## Regras de Autorização

O sistema utiliza controle de acesso baseado em autenticação JWT (Bearer Token) e papéis específicos (admin):

| Operação           | Método | Endpoint       | Requer Autenticação | Papel Requerido |
| ------------------ | ------ | -------------- | ------------------- | --------------- |
| Listar alérgenos   | GET    | /allergens     | Não                 | Público         |
| Detalhar alérgeno  | GET    | /allergens/:id | Não                 | Público         |
| Criar alérgeno     | POST   | /allergens     | Sim                 | Administrador   |
| Atualizar alérgeno | PATCH  | /allergens/:id | Sim                 | Administrador   |
| Remover alérgeno   | DELETE | /allergens/:id | Sim                 | Administrador   |

---

## Endpoints e DTOs

### 1. Listar todos os alergênicos

Retorna a lista completa de alérgenos registrados na plataforma.

- URL: /allergens
- Método: GET

Exemplo de resposta (200 OK):

```json
[
  {
    "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "name": "Amendoim"
  },
  {
    "id": "9a2f4c1d-63f0-4d1a-8d66-4a8f7e2b4567",
    "name": "Leite"
  }
]
```

---

### 2. Buscar alergênico por ID

Retorna os detalhes de um alérgeno específico através do seu identificador único.

- URL: /allergens/:id
- Método: GET
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do alérgeno.

Exemplo de resposta (200 OK):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Amendoim"
}
```

**Respostas de Erro Comuns:**

- 404 Not Found: Alergênico não encontrado na base de dados.

---

### 3. Criar alergênico

Adiciona um novo registro à lista global do sistema.

- URL: /allergens
- Método: POST
- Segurança: Bearer Auth Token (authMiddleware, adminMiddleware)

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo   | Validação                     | Descrição                    |
| ----- | ------ | ----------------------------- | ---------------------------  |
| name  | string | Obrigatório, Min: 2, Max: 100 | Nome descritivo do alérgeno. |

Exemplo de requisição:

```json
{
  "name": "Amendoim"
}
```

Exemplo de resposta (201 Created):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Amendoim"
}```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token ausente ou inválido.
- 403 Forbidden: Acesso negado (usuário não possui papel de administrador).

---

### 4. Atualizar alergênico

Modifica o nome ou propriedades de um registro existente.

- URL: /allergens/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware, adminMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do alérgeno a ser atualizado.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo   | Validação                     | Descrição             |
| ------| -------| ----------------------------- | --------------------- |
| name  | string | Obrigatório, Min: 2, Max: 100 | Novo nome descritivo. |

Exemplo de requisição:

```json
{
  "name": "Amendoim torrado"
}
```

Exemplo de resposta (200 OK):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Amendoim torrado"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token ausente ou inválido.
- 403 Forbidden: Acesso negado.
- 404 Not Found: Alergênico não encontrado.

---

### 5. Remover alergênico

Exclui permanentemente um alérgeno da lista do sistema.

- URL: /allergens/:id
- Método: DELETE
- Segurança: Bearer Auth Token (authMiddleware, adminMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do alérgeno a ser removido.

Exemplo de resposta (204 No Content):

*Sem corpo de resposta.*

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token ausente ou inválido.
- 403 Forbidden: Acesso negado.
- 404 Not Found: Alergênico não encontrado.
