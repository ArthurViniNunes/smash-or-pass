# Moderação de Conteúdo

Este módulo centraliza o fluxo de auditoria, aprovação e rejeição de submissões realizadas pela comunidade na plataforma **Smash or Pass**. Ele funciona como uma camada de governança, garantindo que receitas, categorias e ingredientes propostos por usuários comuns passem pelo crivo de moderadores antes de serem expostos publicamente.

---

## Objetivos do Módulo

- Centralizar o controle de qualidade e a curadoria de dados inseridos na plataforma.
- Filtrar e listar em lote todas as entidades que aguardam revisão operacional.
- Fornecer mecanismos para alteração de estados cadastrais (`PENDING`, `APPROVED`, `REJECTED`) de forma granular.

---

## Fluxos Suportados

1. Auditoria de Pendências: O corpo administrativo solicita a fila unificada de itens que demandam atenção técnica.
2. Homologação/Recusa de Dados: Moderadores alteram individualmente o status de ciclo de vida de receitas, categorias ou ingredientes com base nas diretrizes da comunidade.

---

## Regras de Autorização

Diferente de outros módulos, este router aplica restrições globais em nível de arquivo. Nenhuma operação é pública, exigindo obrigatoriamente autenticação de sessão (`authMiddleware`) e papel estrito de nível corporativo (`roleMiddleware` configurado como `ADMIN`):

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Listar itens pendentes | GET | /moderation/pending | Sim | Administrador |
| Moderar receita | PATCH | /moderation/recipes/:id | Sim | Administrador |
| Moderar categoria | PATCH | /moderation/categories/:id | Sim | Administrador |
| Moderar ingrediente | PATCH | /moderation/ingredients/:id | Sim | Administrador |

---

## Endpoints e DTOs

### 1. Listar itens pendentes de moderação

Consolida e retorna três arrays segregados contendo todas as submissões que se encontram em estado de espera no banco de dados.

- URL: /moderation/pending
- Método: GET
- Segurança: Bearer Auth Token (authMiddleware, roleMiddleware: ADMIN)

Exemplo de resposta (200 OK):

```json
{
  "recipes": [
    {
      "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "title": "Bolo de Caneca Ultrarápido",
      "status": "PENDING",
      "userId": "cm1q2w3e4r5t6y7u8i9o0p"
    }
  ],
  "categories": [
    {
      "id": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
      "name": "Café da Manhã Fit",
      "status": "PENDING"
    }
  ],
  "ingredients": [
    {
      "id": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
      "name": "Leite de Amêndoas",
      "status": "PENDING"
    }
  ]
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token de segurança ausente ou corrompido.
- 403 Forbidden: O usuário autenticado não possui a role `ADMIN`.

---

### 2. Moderar receita

Altera o status de avaliação de uma receita específica para aprovação ou rejeição formal na plataforma.

- URL: /moderation/recipes/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware, roleMiddleware: ADMIN)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID da receita a ser avaliada.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| status | string | Obrigatório, Enum: `PENDING`, `APPROVED`, `REJECTED` | Novo estado cadastral do item. |

Exemplo de requisição:

```json
{
  "status": "APPROVED"
}
```

**Respostas de Erro Comuns:**

- 400 Bad Request: O valor do status enviado não corresponde ao enum aceito.
- 401 Unauthorized: Credenciais de acesso ausentes no cabeçalho.
- 403 Forbidden: Acesso negado por falta de privilégio operacional.
- 404 Not Found: Nenhuma receita correspondente ao UUID foi localizada.

---

### 3. Moderar categoria

Atualiza as diretrizes de publicação de uma categoria sugerida pelos usuários.

- URL: /moderation/categories/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware, roleMiddleware: ADMIN)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID da categoria alvo.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| status | string | Obrigatório, Enum: `PENDING`, `APPROVED`, `REJECTED` | Novo estado cadastral da categoria. |

Exemplo de requisição:

```json
{
  "status": "REJECTED"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Falha na identificação por token JWT.
- 403 Forbidden: Operação restrita a administradores do sistema.
- 404 Not Found: Categoria não cadastrada na base.

---

### 4. Moderar ingrediente

Aprova ou invalida o ingresso de um novo ingrediente proposto na listagem do catálogo público global.

- URL: /moderation/ingredients/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware, roleMiddleware: ADMIN)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do ingrediente a ser moderado.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| status | string | Obrigatório, Enum: `PENDING`, `APPROVED`, `REJECTED` | Novo estado cadastral do ingrediente. |

Exemplo de requisição:

```json
{
  "status": "APPROVED"
}
```

**Respostas de Erro Comuns:**

- 400 Bad Request: O payload falhou na validação estrutural do enum.
- 401 Unauthorized: Token de autenticação Bearer ausente.
- 403 Forbidden: Usuário não possui credencial de administrador.
- 404 Not Found: Registro do ingrediente não mapeado no banco de dados.
