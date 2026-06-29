# Cadastro e Autenticação (api/authentication.md)

Este módulo é responsável por gerenciar o ciclo de vida da sessão dos usuários na plataforma **Smash or Pass**, englobando desde a criação de novas contas até a emissão e validação de Tokens JWT para chamadas autenticadas.

---

## Objetivos do Módulo

- Permitir o auto-cadastro de novos usuários na plataforma de maneira pública.
- Autenticar usuários via e-mail e senha, retornando um token de acesso de curta duração (Bearer Token).
- Disponibilizar um endpoint de checagem de perfil (/me) para que o frontend reconstrua o estado da sessão do usuário logado.

---

## Fluxos Suportados

1. Registro de Usuário: O visitante fornece os dados cadastrais obrigatórios e cria um perfil com a permissão padrão (USER).
2. Autenticação (Login): O usuário submete suas credenciais, o sistema valida a integridade dos dados e retorna um token JWT assinado.
3. Validação de Sessão: O cliente web/mobile envia o token nas requisições subsequentes para obter suas informações de perfil atualizadas.

---

## Regras de Autorização

As rotas de criação e verificação de chaves de acesso possuem restrições específicas dependendo da necessidade de identificação prévia:

| Operação | Método | Endpoint | Requer Autenticação | Papel Requerido |
| :--- | :---: | :--- | :---: | :---: |
| Registrar usuário | POST | /auth/register | Não | Público |
| Autenticar usuário | POST | /auth/login | Não | Público |
| Obter dados do perfil | GET | /auth/me | Sim | Qualquer Usuário |

---

## Endpoints e DTOs

### 1. Registrar usuário

Cria uma nova conta de usuário no sistema. Por padrão, todo usuário recém-registrado recebe o nível de acesso USER.

- URL: /auth/register
- Método: POST

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| name | string | Obrigatório | Nome de exibição do usuário. |
| username | string | Obrigatório | Nome de usuário único na plataforma. |
| email | string | Obrigatório, Formato Email | Endereço de e-mail único. |
| password | string | Obrigatório | Senha para acesso à conta. |

Exemplo de requisição:

```json
{
  "name": "Arthur Nunes",
  "username": "arthur_nunes",
  "email": "arthur@example.com",
  "password": "Senha@1234"
}
```

#### Resposta de Sucesso (201 Created)

```json
{
  "id": "cm1q2w3e4r5t6y7u8i9o0p",
  "name": "Arthur Nunes",
  "username": "arthur_nunes",
  "email": "arthur@example.com",
  "role": "USER"
}
```

**Respostas de Erro Comuns:**

- 409 Conflict: O e-mail ou o username informado já está em uso por outra conta no banco de dados.

---

### 2. Autenticar usuário

Valida as credenciais do usuário e retorna o token de acesso indispensável para requisições seguras.

- URL: /auth/login
- Método: POST

**Request Body (Data Transfer Object - DTO):**

| Campo | Tipo | Validação | Descrição |
| :--- | :---: | :--- | :--- |
| email | string | Obrigatório, Formato Email | E-mail da conta cadastrada. |
| password | string | Obrigatório | Senha correspondente. |

Exemplo de requisição:

```json
{
  "email": "arthur@example.com",
  "password": "Senha@1234"
}
```

**Resposta de Sucesso (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm1q2w3e4r5t6y7u8i9o0p",
    "name": "Arthur Nunes",
    "username": "arthur_nunes",
    "role": "USER"
  }
}
```
> O token é assinado via JWT e possui expiração configurada no backend (não persistente).

**Respostas de Erro Comuns:**

- 401 Unauthorized: Credenciais inválidas ou não autenticadas.

---

### 3. Obter dados do usuário autenticado

Retorna os dados básicos da sessão autenticada do usuário com base no token JWT.

- URL: /auth/me
- Método: GET
- Segurança: Bearer Auth Token (authMiddleware)

**Resposta de Sucesso (200 OK):**

```json
{
  "id": "cm1q2w3e4r5t6y7u8i9o0p",
  "name": "Arthur Nunes",
  "username": "arthur_nunes",
  "email": "arthur@example.com",
  "role": "USER",
  "avatarUrl": null,
  "bio": null
}
```

> Nota: Dados completos de perfil (bio, alergênicos, preferências) são gerenciados no módulo /users.

**Respostas de Erro Comuns:**

- 401 Unauthorized: Token de autenticação ausente, expirado ou com token com assinatura inválida.
- 404 Not Found: O ID contido no payload do token não corresponde a nenhum usuário ativo na base.
