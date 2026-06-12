# Painel Administrativo e Métricas (api/dashboard.md)

Este módulo centraliza a agregação de indicadores estatísticos e métricas operacionais do sistema **Smash or Pass**. Ele consolida os dados de engajamento e o volume de cadastros pendentes de moderação, fornecendo uma visão macro para a tomada de decisões gerenciais.

---

## Objetivos do Módulo

- Fornecer um panorama estatístico unificado dos principais recursos e entidades do banco de dados.
- Viabilizar o monitoramento do fluxo de aprovação de receitas, ingredientes e categorias.
- Quantificar o engajamento geral dos usuários na plataforma a partir da contagem agregada de interações lógicas (smashes e passes).

---

## Fluxos Suportados

1. Consolidação de Dados: Agrupamento em tempo de execução ou cacheamento estruturado das volumetrias da aplicação para municiar o front-end administrativo de gráficos e cartões de resumo.

---

## Regras de Autorização

O acesso ao endpoint deste módulo é severamente restrito, exigindo verificação de identidade em duas camadas (autenticação de sessão e validação de escopo hierárquico):

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Obter métricas gerais | GET | /dashboard | Sim | Administrador |

---

## Endpoints e DTOs

### 1. Obter métricas gerais do painel

Realiza o levantamento quantitativo de usuários, comentários, taxonomias e o estado operacional das receitas e ingredientes.

- URL: /dashboard
- Método: GET
- Segurança: Bearer Auth Token (authMiddleware, adminMiddleware)

Exemplo de resposta (200 OK):

```json
{
  "users": 120,
  "recipes": 58,
  "approvedRecipes": 44,
  "pendingRecipes": 10,
  "rejectedRecipes": 4,
  "categories": 18,
  "pendingCategories": 3,
  "ingredients": 72,
  "pendingIngredients": 6,
  "comments": 240,
  "smashes": 840,
  "passes": 412
}
```

#### Respostas de Erro Comuns

- 401 Unauthorized: Token de autenticação Bearer JWT ausente, expirado ou corrompido.
- 403 Forbidden: O usuário está autenticado, porém não possui privilégios do papel administrativo (ADMIN).
