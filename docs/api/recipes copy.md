# Gerenciamento de Receitas

Este módulo centraliza as operações de CRUD (*Create, Read, Update, Delete*) para o catálogo de receitas da plataforma. Ele lida com a listagem pública de conteúdos validados, detalhamento técnico de pratos (incluindo relacionamentos complexos com autores, categorias, comentários e preferências dietéticas) e a governança de autoria para modificações na base de dados.

---

## Objetivos do Módulo

- Disponibilizar um catálogo aberto e detalhado de receitas aprovadas para consumo da aplicação.
- Permitir que usuários autenticados submetam novas receitas, vinculando dinamicamente ingredientes, categorias e restrições alimentares.
- Garantir a integridade do catálogo blindando rotas de alteração (`PATCH`, `DELETE`) através de validações de propriedade e autoria.

---

## Fluxos Suportados

1. **Descoberta Pública**: Qualquer visitante (autenticado ou não) pode listar todas as receitas homologadas ou buscar os detalhes estruturados de um prato específico pelo ID.
2. **Submissão de Conteúdo**: Usuários validados criam rascunhos de receitas que entram no sistema inicialmente com o estado de auditoria (`PENDING`).
3. **Manutenção do Catálogo**: Autores realizam atualizações parciais ou realizam a exclusão de suas respectivas postagens.

---

## Regras de Autorização e Controle de Acesso

Diferente do escopo de interações, este roteador aplica segurança granular baseada no método HTTP. Consultas de leitura são públicas, enquanto mutações exigem validação de identidade e posse do recurso:

| Operação | Método | Endpoint | Requer Autenticação | Regra de Negócio / Permissão |
| :--- | :---: | :--- | :---: | :--- |
| Listar receitas aprovadas | GET | `/recipes` | Não | Livre acesso público. Apenas status `APPROVED`. |
| Buscar receita por ID | GET | `/recipes/:id` | Não | Livre acesso público. Retorna nós completos de comentários e autor. |
| Criar nova receita | POST | `/recipes` | **Sim** | Usuário logado via JWT. Salva com status inicial `PENDING`. |
| Atualizar receita existente | PATCH | `/recipes/:id` | **Sim** | Apenas o **autor original** da receita pode modificá-la. |
| Remover receita do catálogo | DELETE | `/recipes/:id` | **Sim** | Apenas o **autor original** ou administradores podem expurgar o registro. |

---

## Endpoints e DTOs

### 1. Listar todas as receitas aprovadas

Retorna uma coleção compacta de receitas que passaram pelo crivo de moderação do sistema.

- **URL**: `/recipes`
- **Método**: GET
- **Segurança**: Pública (Livre)

**Resposta de Sucesso (200 OK):**

Retorna um array de objetos contendo os metadados da receita, o perfil resumido do autor, categorias associadas, preferências de dieta e a listagem de ingredientes.

---

### 2. Buscar receita por ID

Fornece a árvore completa de dados de uma única receita, incluindo o array cronológico de comentários deixados pela comunidade.

- **URL**: `/recipes/:id`
- **Método**: GET
- **Parâmetro de Path**: `id` (string, formato UUID)
- **Segurança**: Pública (Livre)

**Resposta de Sucesso (200 OK):**

Além dos dados estruturais de ingredientes e categorias, anexa o nó `comments` mapeando o conteúdo e o `username` de quem comentou.

**Respostas de Erro comuns:**

- 404 Not Found: O identificador fornecido não consta no banco de dados.

---

### 3. Criar receita

Registra uma nova proposta de prato na plataforma.

- **URL**: `/recipes`
- **Método**: POST
- **Segurança**: Bearer Auth Token (`authMiddleware`)

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Exemplo |
| :--- | :---: | :--- | :--- |
| **title** | string | Obrigatório, de 3 a 150 caracteres | `"Macarrão ao pesto"` |
| **description** | string | Obrigatório, de 10 a 1000 caracteres | `"Receita simples e rápida..."` |
| **preparationMethod** | string | Obrigatório, mínimo 10 caracteres | `"Cozinhe o macarrão e..."` |
| **preparationTimeMinutes** | integer | Obrigatório, valor mínimo: 1 | `25` |
| **difficulty** | string | Obrigatório, Enum: `EASY`, `MEDIUM`, `HARD` | `"EASY"` |
| **categoryIds** | array | Mínimo 1 item. Itens em formato UUID | `["7b54-4e0b-9b2e-5a7fd0a1d123"]` |
| **dietPreferenceIds** | array | Opcional, default: `[]`. Itens em UUID | `["6b54-4e0b-9b2e-5a7fd0a1d124"]` |
| **ingredients** | array | Mínimo 1 item. Objetos estruturados (veja abaixo) | *Ver payload estruturado* |

#### Estrutura do Objeto de Ingredientes (dentro do array)

- `ingredientId` (string, obrigatório, UUID)
- `quantity` (number, obrigatório, mínimo: 0)
- `unit` (string, obrigatório, preenchido)

#### Resposta de Sucesso (201 Created)

Retorna o espelho da receita persistida com o status setado em `PENDING`.

---

### 4. Atualizar receita

Modifica os campos estruturais de uma receita existente caso o solicitante seja o proprietário do registro.

- **URL**: `/recipes/:id`
- **Método**: PATCH
- **Parâmetro de Path**: `id` (string, formato UUID)
- **Segurança**: Bearer Auth Token (`authMiddleware`)

**Request Body (Data Transfer Object - DTO):**

Seguindo o mesmo esquema de validação do método de criação (`POST`), permitindo remapeamento completo de tabelas pivô de ingredientes e categorias.

**Respostas de Erro comuns:**

- 400 Bad Request: Dados ou IDs de relacionamentos inconsistentes.
- 401 Unauthorized: Ausência de credenciais válidas no header.
- 403 Forbidden: O token pertence a um usuário que não é o `authorId` do registro.
- 404 Not Found: UUID inexistente.

---

### 5. Deletar receita

Remove de forma definitiva uma receita da base de dados, desencadeando a limpeza de seus vínculos relacionais.

- **URL**: `/recipes/:id`
- **Método**: DELETE
- **Parâmetro de Path**: `id` (string, formato UUID)
- **Segurança**: Bearer Auth Token (`authMiddleware`)

#### Resposta de Sucesso (204 No Content)

*Corpo limpo confirmando o sucesso da operação.*

**Respostas de Erro comuns:**

- 401 Unauthorized: Identidade não provada.
- 403 Forbidden: Tentativa de exclusão de conteúdo de terceiros.
- 404 Not Found: ID não localizado para deleção.
