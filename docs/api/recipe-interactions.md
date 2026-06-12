# Interações e Feed de Receitas

Este módulo implementa a mecânica principal de descoberta e engajamento da plataforma **Smash or Pass**. Ele gerencia o algoritmo de distribuição do feed de cartões de culinária e computa as ações de deslizar (*swipes*), permitindo que os usuários classifiquem receitas e gerenciem o histórico imediato de suas escolhas.

---

## Objetivos do Módulo

- Disponibilizar um fluxo contínuo e personalizado de receitas prontas para a avaliação do usuário logado.
- Computar e registrar decisões de aprovação (`SMASH`) ou descarte (`PASS`) para refinar o motor de recomendações.
- Permitir a reversão imediata da última ação tomada, mitigando interações errôneas no front-end.

---

## Fluxos Suportados

1. Consumo do Feed: O aplicativo requisita um lote controlado de receitas elegíveis e ainda não avaliadas pelo perfil corrente.
2. Tomada de Decisão (Swipe): O usuário executa um gesto na interface que envia a sinalização lógica do par analítico (`SMASH` ou `PASS`).
3. Arrependimento de Ação (Undo): O usuário solicita o cancelamento do seu último voto, devolvendo a receita ao fluxo operacional do feed.

---

## Regras de Autorização

Este roteador adota isolamento completo em nível de arquivo por meio do barramento de autenticação global. Nenhuma rota exposta neste escopo aceita requisições anônimas:

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Registrar swipe | POST | /interactions/swipe | Sim | Qualquer Usuário |
| Obter feed personalizado | GET | /interactions/feed | Sim | Qualquer Usuário |
| Desfazer última interação | POST | /interactions/undo | Sim | Qualquer Usuário |

---

## Endpoints e DTOs

### 1. Registrar swipe em uma receita

Computa a escolha do usuário sobre uma receita específica, indexando o evento para métricas e regras de negócio.

- URL: /interactions/swipe
- Método: POST
- Segurança: Bearer Auth Token (`authMiddleware`)

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| recipeId | string | Obrigatório, Formato UUID | Identificador exclusivo da receita avaliada. |
| type | string | Obrigatório, Enum: `SMASH`, `PASS` | Direcionamento da decisão/gesto executado. |

Exemplo de requisição:

```json
{
  "recipeId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
  "type": "SMASH"
}
```

#### Resposta de Sucesso (200 OK)

*Corpo vazio ou objeto de confirmação da transação de persistência.*

**Respostas de Erro Comuns:**

- 400 Bad Request: Dados do payload fora do padrão estrutural ou enum incorreto.
- 401 Unauthorized: Token JWT ausente, corrompido ou expirado.
- 404 Not Found: O UUID informado não corresponde a nenhuma receita ativa na base.

---

### 2. Obter feed de receitas para o usuário autenticado

Gera uma listagem de receitas disponíveis para interação, omitindo os itens com os quais o usuário já interagiu previamente.

- URL: /interactions/feed
- Método: GET
- Segurança: Bearer Auth Token (`authMiddleware`)
- Parâmetros de Query (Opcionais):
  - limit (integer, default: 10): Quantidade máxima de registros retornados por paginação.

Exemplo de resposta (200 OK):

```json
[
  {
    "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "title": "Massa Carbonara Clássica",
    "description": "Uma receita tradicional italiana com guanciale e pecorino.",
    "imageUrl": "https://cdn.smashorpass.com/recipes/carbonara.jpg",
    "createdAt": "2026-06-11T14:20:00.000Z"
  }
]
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Usuário não autenticado no barramento.

---

### 3. Desfazer a última interação do usuário

Remove o último registro de interação (`SMASH` ou `PASS`) do usuário do histórico, permitindo que a receita retorne ao feed de decisões.

- URL: /interactions/undo
- Método: POST
- Segurança: Bearer Auth Token (`authMiddleware`)

Exemplo de resposta (200 OK):

```json
{
  "undone": true
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Falha na identificação por token Bearer.
- 404 Not Found: Nenhuma interação recente foi localizada para o usuário solicitante dentro da janela de reversão.
