# Restrições de Alergênicos do Usuário

Este módulo é responsável por gerenciar as restrições alimentares e alergias do perfil do usuário autenticado. Os dados configurados aqui servem como insumo para os motores de recomendação da plataforma, permitindo filtrar ou alertar sobre ingredientes nocivos à saúde do usuário no feed de receitas.

---

## Objetivos do Módulo

- Permitir o mapeamento personalizado de alergias alimentares diretamente no perfil do usuário logado.
- Fornecer endpoints ágeis para anexar ou remover restrições à lista de segurança do usuário.
- Garantir o isolamento de dados, permitindo apenas a manipulação do próprio escopo (`/me`) mediante validação de token.

---

## Fluxos Suportados

1. **Consulta de Perfil Alérgico**: O aplicativo lê a lista atual de restrições registradas para renderizar painéis de configuração ou aplicar filtros em tela.
2. **Vínculo de Restrição**: O usuário seleciona um alergênico catalogado no sistema e o adiciona ao seu histórico de segurança médica/alimentar.
3. **Revogação de Alergia**: O usuário remove um item previamente marcado, normalizando o consumo de receitas que contenham o respectivo ingrediente.

---

## Regras de Autorização

Assim como o módulo de interações, este roteador adota segurança em nível de arquivo por meio do middleware de autenticação global. O escopo das rotas é restrito exclusivamente ao usuário portador do token (`/me`):

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Listar alergênicos salvos | GET | `/users/me/allergens` | Sim | Qualquer Usuário |
| Adicionar alergênico ao perfil | POST | `/users/me/allergens/:allergenId` | Sim | Qualquer Usuário |
| Remover alergênico do perfil | DELETE | `/users/me/allergens/:allergenId` | Sim | Qualquer Usuário |

---

## Endpoints e DTOs

### 1. Listar alergênicos do usuário autenticado

Retorna todos os registros de alergia vinculados à conta do usuário que realizou a chamada.

- **URL**: `/users/me/allergens`
- **Método**: GET
- **Segurança**: Bearer Auth Token (`authMiddleware`)

#### Resposta de Sucesso (200 OK)

Retorna um array de objetos contendo o ID do relacionamento e o objeto do alergênico populado com suas propriedades textuais.

Exemplo de resposta:

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

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token JWT ausente, corrompido ou expirado.

---

### 2. Adicionar alergênico ao usuário autenticado

Cria uma nova associação entre o usuário logado e um alergênico global pré-existente na base de dados.

- **URL**: `/users/me/allergens/:allergenId`
- **Método**: POST
- **Parâmetro de Path**: `allergenId` (string, formato UUID)
- **Segurança**: Bearer Auth Token (`authMiddleware`)

#### Resposta de Sucesso (201 Created)

Retorna o espelho do par de chaves indexado na tabela de relacionamento do banco de dados.

Exemplo de resposta:

```json
{
  "userId": "cm1q2w3e4r5t6y7u8i9o0p",
  "allergenId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Usuário não autenticado no barramento.
- 404 Not Found: O `allergenId` enviado no path não corresponde a nenhum componente catalogado na plataforma.

---

### 3. Remover alergênico do usuário autenticado

Desfaz o vínculo de alergia, removendo a restrição automática do motor de busca e do feed do usuário.

- **URL**: `/users/me/allergens/:allergenId`
- **Método**: DELETE
- **Parâmetro de Path**: `allergenId` (string, formato UUID)
- **Segurança**: Bearer Auth Token (`authMiddleware`)

#### Resposta de Sucesso (204 No Content)

*Corpo vazio confirmando a exclusão lógica/física do vínculo.*

**Respostas de Erro Comuns:**

- 401 Unauthorized: Falha na identificação por token Bearer.
