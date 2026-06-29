# Gerenciamento de Categorias

Este módulo centraliza o gerenciamento das categorias de receitas (ex: Massas, Sobremesas, Saladas) na plataforma **Smash or Pass**. O sistema prevê um mecanismo de sugestão ou moderação em que novas categorias entram inicialmente com o estado pendente antes de sua total homologação.

---

## Objetivos do Módulo

- Organizar e agrupar as receitas do ecossistema por meio de marcadores categóricos.
- Permitir que usuários autenticados expandam o catálogo sugerindo novas categorias de forma dinâmica.
- Disponibilizar listagens públicas apenas de itens validados e aprovados.

---

## Fluxos Suportados

1. Consulta Pública: Qualquer visitante pode listar as categorias ativas (`APPROVED`) ou inspecionar um registro específico por ID.
2. Sugestão de Categorias: Usuários logados criam novos registros que entram automaticamente com o status `PENDING` para posterior validação.
3. Edição e Limpeza: Usuários autorizados alteram a nomenclatura ou removem registros obsoletos da base de dados.

---

## Regras de Autorização

O roteamento protege operações de mutação de dados enquanto mantém consultas totalmente expostas à rede:

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Listar categorias | GET | /categories | Não | Público |
| Detalhar categoria | GET | /categories/:id | Não | Público |
| Criar categoria | POST | /categories | Sim | Qualquer Usuário |
| Atualizar categoria | PATCH | /categories/:id | Sim | Usuário / Admin |
| Remover categoria | DELETE | /categories/:id | Sim | Usuário / Admin |

---

## Endpoints e DTOs

### 1. Listar todas as categorias aprovadas

Retorna o vetor de categorias homologadas pelo sistema, trazendo também os dados básicos de quem realizou a criação do item.

- URL: /categories
- Método: GET

Exemplo de resposta (200 OK):

```json
[
  {
    "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "name": "Massas",
    "status": "APPROVED",
    "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
    "createdAt": "2026-06-10T04:22:33.000Z",
    "createdBy": {
      "id": "cm1q2w3e4r5t6y7u8i9o0p",
      "username": "arthur_nunes"
    }
  }
]
```

---

### 2. Buscar categoria por ID

Obtém a estrutura completa de uma categoria específica por meio do identificador uuid informado no path da requisição.

- URL: /categories/:id
- Método: GET
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID da categoria alvo.

Exemplo de resposta (200 OK):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Massas",
  "status": "APPROVED",
  "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-10T04:22:33.000Z",
  "createdBy": {
    "id": "cm1q2w3e4r5t6y7u8i9o0p",
    "username": "arthur_nunes"
  }
}
```

**Respostas de Erro Comuns:**

- 404 Not Found: Categoria não localizada no banco de dados.

---

### 3. Criar categoria

Efetua a inserção de uma nova proposta de categoria. O registro assume o status `PENDING` por padrão no momento da persistência.

- URL: /categories
- Método: POST
- Segurança: Bearer Auth Token (authMiddleware)

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| name | string | Obrigatório, Min: 2, Max: 100 | Título textual da categoria. |

Exemplo de requisição:

```json
{
  "name": "Massas"
}
```

Exemplo de resposta (201 Created):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Massas",
  "status": "PENDING",
  "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-10T04:22:33.000Z"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Usuário não autenticado via token.
- 409 Conflict: Já existe uma categoria registrada com o nome informado.

---

### 4. Atualizar categoria

Altera os metadados ou a identificação nominal de uma determinada categoria cadastrada.

- URL: /categories/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): Identificador da categoria a atualizar.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| name | string | Obrigatório, Min: 2, Max: 100 | Novo nome atualizado. |

Exemplo de requisição:

```json
{
  "name": "Massas e Cereais"
}
```

Exemplo de resposta (200 OK):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Massas e Cereais",
  "status": "APPROVED",
  "createdById": "cm1q2w3e4r5t6y7u8i9o0p",
  "createdAt": "2026-06-10T04:22:33.000Z"
}
```
  
**Respostas de Erro Comuns:**

- 401 Unauthorized: Assinatura ou credencial inválida.
- 403 Forbidden: Acesso negado por falta de privilégios para este registro.
- 404 Not Found: Categoria não encontrada para atualização.

---

### 5. Remover categoria

Exclui de forma definitiva um registro de categoria da aplicação.

- URL: /categories/:id
- Método: DELETE
- Segurança: Bearer Auth Token (authMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): Identificador da categoria a excluir.

Exemplo de resposta (204 No Content):

*Sem corpo de resposta.*

**Respostas de Erro Comuns:**

- 401 Unauthorized: Autenticação ausente.
- 403 Forbidden: O usuário não possui permissão de exclusão deste item.
- 404 Not Found: Registro não encontrado na base.
