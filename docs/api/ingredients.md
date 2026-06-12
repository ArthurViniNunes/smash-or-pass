# Catálogo de Ingredientes

Este módulo é responsável por gerenciar o inventário global de ingredientes disponíveis na plataforma **Smash or Pass**. Ele mapeia os insumos que compõem as receitas e gerencia as associações lógicas com os respectivos alérgenos cadastrados no sistema.

---

## Objetivos do Módulo

- Catalogar de forma padronizada os ingredientes que servem de base para a montagem de receitas.
- Mapear de forma granular quais alérgenos estão contidos ou relacionados a cada ingrediente específico.
- Prover rotas de inserção e curadoria de dados para enriquecimento contínuo da base da aplicação.

---

## Fluxos Suportados

1. Listagem Informativa: Permite a leitura aberta dos ingredientes cadastrados, expondo o status operacional de aprovação do item.
2. Mapeamento de Riscos: Retorna a árvore detalhada do ingrediente, acoplando um vetor de sub-objetos com os alérgenos identificados no insumo.
3. Ciclo de Vida: Usuários autenticados propõem novos insumos que ingressam sob o status `PENDING`, enquanto edições e limpezas preservam a consistência de dados do catálogo.

---

## Regras de Autorização

As rotas públicas garantem livre leitura, enquanto endpoints de mutação exigem credencial JWT via cabeçalho de requisição:

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Listar ingredientes | GET | /ingredients | Não | Público |
| Detalhar ingrediente e alérgenos | GET | /ingredients/:id | Não | Público |
| Criar ingrediente | POST | /ingredients | Sim | Qualquer Usuário |
| Atualizar ingrediente | PATCH | /ingredients/:id | Sim | Usuário / Admin |
| Remover ingrediente | DELETE | /ingredients/:id | Sim | Usuário / Admin |

---

## Endpoints e DTOs

### 1. Listar todos os ingredientes

Retorna a listagem total de ingredientes armazenados no sistema, discriminando o estado de homologação de cada registro.

- URL: /ingredients
- Método: GET

Exemplo de resposta (200 OK):

```json
[
  {
    "id": "5b54-4e0b-9b2e-5a7fd0a1d126",
    "name": "Tomate",
    "status": "APPROVED",
    "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
    "createdAt": "2026-06-10T04:22:33.000Z",
    "updatedAt": "2026-06-10T04:22:33.000Z"
  },
  {
    "id": "6b54-4e0b-9b2e-5a7fd0a1d127",
    "name": "Alho",
    "status": "PENDING",
    "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
    "createdAt": "2026-06-10T04:22:33.000Z",
    "updatedAt": "2026-06-10T04:22:33.000Z"
  }
]
```

---

### 2. Buscar ingrediente por ID

Obtém o registro detalhado de um ingrediente com o aninhamento relacional completo de seus alérgenos correspondentes.

- URL: /ingredients/:id
- Método: GET
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do ingrediente alvo.

Exemplo de resposta (200 OK):

```json
{
  "id": "5b54-4e0b-9b2e-5a7fd0a1d126",
  "name": "Tomate",
  "status": "APPROVED",
  "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-10T04:22:33.000Z",
  "updatedAt": "2026-06-10T04:22:33.000Z",
  "allergens": [
    {
      "ingredientId": "5b54-4e0b-9b2e-5a7fd0a1d126",
      "allergenId": "3b54-4e0b-9b2e-5a7fd0a1d128",
      "allergen": {
        "id": "3b54-4e0b-9b2e-5a7fd0a1d128",
        "name": "Glúten"
      }
    }
  ]
}
```

**Respostas de Erro Comuns:**

- 404 Not Found: Ingrediente não cadastrado na base de dados.

---

### 3. Criar ingrediente

Adiciona uma nova proposta de insumo alimentar ao catálogo global. O status do registro assume a condição de `PENDING` na criação.

- URL: /ingredients
- Método: POST
- Segurança: Bearer Auth Token (authMiddleware)

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| name | string | Obrigatório, Min: 2, Max: 100 | Nome nominal do ingrediente. |

Exemplo de requisição:

```json
{
  "name": "Tomate"
}
```

Exemplo de resposta (201 Created):

```json
{
  "id": "5b54-4e0b-9b2e-5a7fd0a1d126",
  "name": "Tomate",
  "status": "PENDING",
  "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-10T04:22:33.000Z",
  "updatedAt": "2026-06-10T04:22:33.000Z"
}
```

**Respostas de Erro Comuns:**

- 400 Bad Request: Dados fornecidos no payload falharam nas validações de string.
- 401 Unauthorized: Identificação ausente ou mal formatada no cabeçalho.

---

### 4. Atualizar ingrediente

Altera a designação ou propriedades textuais de um ingrediente específico do banco de dados.

- URL: /ingredients/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do ingrediente a atualizar.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| name | string | Obrigatório, Min: 2, Max: 100 | Novo nome atualizado do ingrediente. |

Exemplo de requisição:

```json
{
  "name": "Tomate Italiano"
}
```

Exemplo de resposta (200 OK):

```json
{
  "id": "5b54-4e0b-9b2e-5a7fd0a1d126",
  "name": "Tomate Italiano",
  "status": "APPROVED",
  "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-10T04:22:33.000Z",
  "updatedAt": "2026-06-10T04:22:33.000Z"
}
```

**Respostas de Erro Comuns:**

- 400 Bad Request: Formato inválido ou fora dos limites do campo `name`.
- 401 Unauthorized: Credenciais de autenticação ausentes.
- 404 Not Found: Registro não mapeado para sofrer a atualização.

---

### 5. Remover ingrediente

Efetua a exclusão definitiva e irreversível do ingrediente indicado no path da URL.

- URL: /ingredients/:id
- Método: DELETE
- Segurança: Bearer Auth Token (authMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do ingrediente a ser deletado.

Exemplo de resposta (204 No Content):
*Sem corpo de resposta.*

**Respostas de Erro Comuns:**

- 401 Unauthorized: Falha na identificação do usuário logado.
- 404 Not Found: Ingrediente não localizado na base.
