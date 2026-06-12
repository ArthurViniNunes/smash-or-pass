# Preferências Alimentares do Usuário

Este módulo é responsável por gerenciar as diretrizes e preferências alimentares (como veganismo, vegetarianismo, dieta low-carb, entre outras) associadas ao perfil do usuário autenticado. Estes dados são fundamentais para personalizar a experiência na plataforma, refinando os critérios de busca e a entrega de receitas no feed.

---

## Objetivos do Módulo

- Permitir que o usuário configure seu estilo de alimentação de forma dinâmica e centralizada.
- Disponibilizar endpoints para listar, vincular e desvincular preferências alimentares no escopo do usuário ativo.
- Assegurar a integridade e privacidade dos dados, exigindo a identificação via token JWT para qualquer operação baseada no contexto `/me`.

---

## Fluxos Suportados

1. **Consulta de Estilo Alimentar**: O sistema mapeia as preferências ativas do usuário para priorizar categorias específicas de receitas na interface principal.
2. **Vínculo de Preferência**: O usuário seleciona um estilo de dieta pré-cadastrado no sistema para moldar as recomendações que recebe.
3. **Revogação de Preferência**: O usuário desmarca uma opção anteriormente ativa, alterando o comportamento do algoritmo de sugestões do feed.

---

## Regras de Autorização

Seguindo o padrão de segurança adotado para dados do perfil, o acesso ao roteador é blindado pelo middleware de autenticação. Todas as ações operam exclusivamente sob a identidade extraída do token (`/me`):

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Listar preferências salvas | GET | `/users/me/diet-preferences` | Sim | Qualquer Usuário |
| Adicionar preferência ao perfil | POST | `/users/me/diet-preferences/:dietPreferenceId` | Sim | Qualquer Usuário |
| Remover preferência do perfil | DELETE | `/users/me/diet-preferences/:dietPreferenceId` | Sim | Qualquer Usuário |

---

## Endpoints e DTOs

### 1. Listar preferências alimentares do usuário autenticado

Retorna a coleção de dietas e preferências associadas à conta do usuário requisitante.

- **URL**: `/users/me/diet-preferences`
- **Método**: GET
- **Segurança**: Bearer Auth Token (`authMiddleware`)

#### Resposta de Sucesso (200 OK)

Retorna uma lista de objetos contendo as chaves de relacionamento e os detalhes da preferência alimentar correspondente.

Exemplo de resposta:

```json
[
  {
    "userId": "cm1q2w3e4r5t6y7u8i9o0p",
    "dietPreferenceId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
    "dietPreference": {
      "id": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123",
      "name": "Vegano"
    }
  }
]
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token JWT inválido, ausente ou expirado.

---

### 2. Adicionar preferência alimentar ao usuário autenticado

Vincula o perfil do usuário logado a uma preferência alimentar global previamente cadastrada.

- **URL**: `/users/me/diet-preferences/:dietPreferenceId`
- **Método**: POST
- **Parâmetro de Path**: `dietPreferenceId` (string, formato UUID)
- **Segurança**: Bearer Auth Token (`authMiddleware`)

#### Resposta de Sucesso (201 Created)

Retorna a confirmação dos identificadores registrados na tabela de associação.

Exemplo de resposta:

```json
{
  "userId": "cm1q2w3e4r5t6y7u8i9o0p",
  "dietPreferenceId": "8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123"
}
```

**Respostas de Erro Comuns:**

- 401 Unauthorized: Falha de autenticação na requisição.
- 404 Not Found: O `dietPreferenceId` fornecido não existe no catálogo do sistema.

---

### 3. Remover preferência alimentar do usuário autenticado

Exclui a associação de preferência alimentar, cessando a filtragem baseada nessa dieta específica.

- **URL**: `/users/me/diet-preferences/:dietPreferenceId`
- **Método**: DELETE
- **Parâmetro de Path**: `dietPreferenceId` (string, formato UUID)
- **Segurança**: Bearer Auth Token (`authMiddleware`)

#### Resposta de Sucesso (204 No Content)

*Corpo sem conteúdo, indicando o encerramento com sucesso da associação.*

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token de acesso ausente ou malformado.
