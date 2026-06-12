# Preferências Alimentares

Este módulo é responsável por gerenciar o catálogo global de preferências alimentares e dietas específicas (ex: Vegana, Vegetariana, Cetogênica) da plataforma **Smash or Pass**. Ele fornece a base para que usuários customizem seus perfis e recebam recomendações condizentes com seus estilos de vida.

---

## Objetivos do Módulo

- Catalogar as diferentes vertentes e regimes alimentares suportados pelo ecossistema do app.
- Disponibilizar endpoints públicos de leitura para alimentar seletores de perfil e filtros de busca no front-end.
- Restringir mutações estruturais (criação, edição e exclusão) exclusivamente ao corpo técnico administrativo.

---

## Fluxos Suportados

1. Listagem de Regimes: Qualquer usuário ou visitante lê a coleção de preferências ativas na plataforma.
2. Controle de Catálogo: Administradores realizam inserções de novas preferências, atualizam nomenclaturas ou removem registros antigos.

---

## Regras de Autorização

As operações que alteram o estado da base dependem da verificação encadeada de identidade (`authMiddleware`) e nível de privilégio (`adminMiddleware`):

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Listar preferências | GET | /diet-preferences | Não | Público |
| Detalhar preferência | GET | /diet-preferences/:id | Não | Público |
| Criar preferência | POST | /diet-preferences | Sim | Administrador |
| Atualizar preferência | PATCH | /diet-preferences/:id | Sim | Administrador |
| Remover preferência | DELETE | /diet-preferences/:id | Sim | Administrador |

---

## Endpoints e DTOs

### 1. Listar todas as preferências alimentares

Retorna o array completo de preferências alimentares cadastradas no sistema.

- URL: /diet-preferences
- Método: GET

Exemplo de resposta (200 OK):

```json
[
  {
    "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "name": "Vegetariana"
  },
  {
    "id": "9a2f4c1d-63f0-4d1a-8d66-4a8f7e2b4567",
    "name": "Vegana"
  }
]
```

---

### 2. Buscar preferência alimentar por ID

Obtém os detalhes textuais de uma única preferência mapeada por meio do seu UUID.

- URL: /diet-preferences/:id
- Método: GET
- Parâmetros de URL:
  - id (string, uuid, obrigatório): Identificador único da preferência alimentar.

Exemplo de resposta (200 OK):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Vegana"
}
```

**Respostas de Erro Comuns:**

- 404 Not Found: Preferência alimentar não localizada no banco de dados.

---

### 3. Criar preferência alimentar

Efetua a inserção de um novo registro de regime dietético na base de dados global.

- URL: /diet-preferences
- Método: POST
- Segurança: Bearer Auth Token (authMiddleware, adminMiddleware)

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| name | string | Obrigatório, Min: 2, Max: 100 | Nome descritivo da preferência dietética. |

Exemplo de requisição:

```json
{
  "name": "Vegetariana"
}
```

Exemplo de resposta (201 Created):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Vegetariana"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Credenciais ausentes ou mal formatadas.
- 403 Forbidden: Usuário logado não possui cargo administrativo para executar a criação.

---

### 4. Atualizar preferência alimentar

Modifica o nome ou propriedades de uma preferência pré-existente no banco de dados.

- URL: /diet-preferences/:id
- Método: PATCH
- Segurança: Bearer Auth Token (authMiddleware, adminMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID da preferência a ser modificada.

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| name | string | Obrigatório, Min: 2, Max: 100 | Novo nome descritivo atualizado. |

Exemplo de requisição:

```json
{
  "name": "Vegetariana estrita"
}
```

Exemplo de resposta (200 OK):

```json
{
  "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "name": "Vegetariana estrita"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token expirado ou rejeitado.
- 403 Forbidden: Acesso negado pelo controle de escopo.
- 404 Not Found: Preferência não encontrada para sofrer a mutação.

---

### 5. Remover preferência alimentar

Apaga de forma definitiva a preferência alimentar indicada a partir da árvore relacional do sistema.

- URL: /diet-preferences/:id
- Método: DELETE
- Segurança: Bearer Auth Token (authMiddleware, adminMiddleware)
- Parâmetros de URL:
  - id (string, uuid, obrigatório): ID do registro a ser expurgado.

Exemplo de resposta (204 No Content):

*Sem corpo de resposta.*

**Respostas de Erro Comuns:**

- 401 Unauthorized: Falha na identificação do usuário.
- 403 Forbidden: Operação restrita a administradores.
- 404 Not Found: O registro correspondente não existe na base.
