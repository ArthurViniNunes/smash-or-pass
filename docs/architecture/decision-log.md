# Architecture Decision Log (ADR)

## Objetivo

Este documento registra decisões arquiteturais relevantes tomadas durante o desenvolvimento do projeto **Smash or Pass**.

Seu objetivo é fornecer contexto, justificativas e impactos das decisões técnicas adotadas pela equipe.

***[Pular para o histórico](#histórico)***

---

## ADR-001 — Arquitetura Cliente-Servidor

**Status:**

- Aceita

**Contexto:**

O projeto exige separação clara entre frontend, backend e persistência de dados.

**Decisão:**

Adotar arquitetura Cliente-Servidor baseada em:

- Frontend React
- Backend Node.js + Express
- PostgreSQL como banco de dados principal

**Consequências:**

- Positivas
  - Separação de responsabilidades.
  - Facilidade de manutenção.
  - Escalabilidade futura.
  - Aderência aos requisitos da disciplina.

- Negativas
  - Necessidade de gerenciamento de comunicação via API REST.

---

## ADR-002 — Backend em Node.js com TypeScript

**Status:**

- Aceita

**Contexto:**

O projeto exige produtividade, ampla documentação e facilidade de integração com o frontend.

**Decisão:**

Utilizar:

- Node.js
- TypeScript
- Express

**Consequências:**

- Positivas
  - Forte ecossistema.
  - Tipagem estática.
  - Facilidade de integração com React.
  - Grande quantidade de material de apoio.

- Negativas
  - Curva de aprendizado adicional relacionada ao TypeScript.

---

## ADR-003 — Utilização do Prisma ORM

**Status:**

- Aceita

**Contexto:**

Era necessário um mecanismo de acesso ao banco que reduzisse código repetitivo e aumentasse a segurança das consultas.

**Decisão:**

Utilizar Prisma ORM.

**Consequências:**

- Positivas
  - Tipagem automática.
  - Migrations integradas.
  - Facilidade de manutenção.
  - Integração nativa com TypeScript.

- Negativas
  - Dependência de geração de código.
  - Camada adicional de abstração.

---

## ADR-004 — PostgreSQL como Banco Principal

**Status:**

- Aceita

**Contexto:**

O sistema necessita de relacionamentos complexos entre usuários, receitas, ingredientes, categorias e interações.

**Decisão:**

Utilizar PostgreSQL como banco de dados principal.

**Consequências:**

- Positivas
  - Forte suporte a relacionamentos.
  - Integridade referencial.
  - Excelente integração com Prisma.

- Negativas
  - Estrutura menos flexível que bancos NoSQL.

---

## ADR-005 — Armazenamento de Imagens por Upload

**Status:**

- Aceita

**Contexto:**

O projeto precisa armazenar imagens de receitas.

**Decisão:**

Utilizar upload de arquivos para armazenamento das imagens.

Serviços externos pagos não serão utilizados.

**Consequências:**

- Positivas
  - Simplicidade de implementação.
  - Independência de serviços terceiros.

- Negativas
  - Necessidade de gerenciamento local dos arquivos.

---

## ADR-006 — Autenticação JWT

**Status:**

- Aceita

**Contexto:**

Era necessário autenticar usuários de forma stateless.

**Decisão:**

Utilizar JSON Web Token (JWT).

Refresh Token não será implementado na primeira versão.

**Consequências:**

- Positivas
  - Simplicidade.
  - Amplamente utilizado.
  - Fácil integração com frontend.

- Negativas
  - Necessidade de novo login após expiração do token.

---

## ADR-007 — Controle de Acesso por Papéis (RBAC)

**Status:**

- Aceita

**Contexto:**

O sistema possui usuários comuns e administradores.

**Decisão:**

Implementar RBAC com os papéis:

- USER
- ADMIN

**Consequências:**

- Positivas
  - Simplicidade.
  - Fácil expansão futura.

- Negativas
  - Controle mais granular exigiria novos papéis.

---

## ADR-008 — Promoção de Administradores Fora da API

**Status:**

- Aceita

**Contexto:**

Endpoints administrativos de promoção poderiam representar riscos de segurança.

**Decisão:**

Administradores serão promovidos diretamente no banco de dados.

Não existirá endpoint para promoção de usuários.

**Consequências:**

- Positivas
  - Redução da superfície de ataque.
  - Simplificação da API.

- Negativas
  - Operação manual.

---

## ADR-009 — Moderação de Conteúdo

**Status:**

- Aceita

**Contexto:**

Receitas, ingredientes e categorias podem ser cadastrados por usuários.

**Decisão:**

Implementar fluxo de aprovação:

- PENDING
- APPROVED
- REJECTED

**Consequências:**

- Positivas
  - Maior qualidade dos dados.
  - Evita conteúdo inadequado.

- Negativas
  - Necessidade de atuação administrativa.

---

## ADR-010 — Ingredientes como Entidades Independentes

**Status:**

- Aceita

**Contexto:**

Era necessário permitir filtros alimentares e identificação de alergênicos.

**Decisão:**

Ingredientes serão armazenados em entidade própria.

Receitas utilizarão relacionamento N:N através de RecipeIngredient.

**Consequências:**

- Positivas
  - Filtros avançados.
  - Reutilização de ingredientes.
  - Associação de alergênicos.

- Negativas
  - Modelo de dados mais complexo.

---

## ADR-011 — Sistema Smash/Pass

**Status:**

- Aceita

**Contexto:**

O principal fluxo do sistema é a descoberta de receitas.

**Decisão:**

Implementar interações:

- SMASH
- PASS

Cada usuário pode possuir apenas uma interação por receita.

**Consequências:**

- Positivas
  - Fluxo simples.
  - Fácil entendimento pelo usuário.

- Negativas
  - Não permite múltiplos tipos de reação.

---

## ADR-012 — Undo da Última Interação

**Status:**

- Aceita

**Contexto:**

Usuários podem realizar interações incorretas por engano.

**Decisão:**

Permitir desfazer apenas a última interação realizada.

**Consequências:**

- Positivas
  - Melhor experiência de uso.
  - Implementação simples.

- Negativas
  - Não permite histórico completo de reversões.

---

## ADR-013 — Documentação como Parte da Entrega

**Status:**

- Aceita

**Contexto:**

A documentação possui peso significativo nos critérios de avaliação da disciplina.

**Decisão:**

Manter documentação sincronizada com:

- ERD
- Regras de negócio
- Prisma
- Swagger/OpenAPI

**Consequências:**

- Positivas
  - Melhor rastreabilidade.
  - Maior qualidade do projeto.
  - Facilita manutenção.

- Negativas
  - Exige disciplina para atualização contínua.

---

### ADR-014 — Exclusão de Usuários Remove Conteúdo Associado

**Status:**

- Aceita

**Contexto:**
A exclusão de um usuário pode deixar conteúdo órfão, como receitas e comentários.

**Decisão:**
A exclusão de um usuário remove automaticamente todo conteúdo associado a ele, incluindo receitas, comentários e interações.

**Consequências:**

- Positivas
  - Evita conteúdo órfão.
  - Mantém integridade do sistema.
- Negativas
  - Perda de dados associada à exclusão do usuário.

### ADR-015 — Dashboard baseado em agregações

**Status:**

- Aceita

**Contexto:**
Necessidade de métricas administrativas.

**Decisão:**
Utilizar agregações em tempo real sobre os dados existentes.

**Consequências:**

- Positivas
  - Não requer tabela específica.
  - Mantém consistência dos dados.
- Negativas
  - Pode ter impacto de performance em grandes volumes de dados.

### ADR-016 — Swagger como documentação operacional da API

**Status:**

- Aceita

**Contexto:**
Necessidade de documentação clara e atualizada da API para facilitar desenvolvimento frontend e manutenção.

**Decisão:**
Utilizar Swagger/OpenAPI para documentar os endpoints da API, garantindo que a documentação esteja sempre alinhada com a implementação.

**Consequências:**

- Positivas
  - Facilita entendimento e uso da API.
  - Permite geração automática de clientes e testes.
- Negativas
  - Aumenta a complexidade na manutenção da documentação.
  - Pode exigir recursos adicionais para a geração e manutenção do Swagger.
  - Requer disciplina para manter a documentação atualizada.

### ADR-017 — Centralização das regras de ownership em helpers reutilizáveis

**Status:**

- Aceita

**Contexto:**
Regras de ownership (ex: "apenas o autor ou administradores podem editar uma receita") são recorrentes e espalhadas por diversos endpoints, o que pode levar a inconsistências e código duplicado.

**Decisão:**
Centralizar as regras de ownership em funções helper reutilizáveis, garantindo que a lógica de autorização seja consistente em toda a aplicação e facilitando a manutenção futura.

**Consequências:**

- Positivas
  - Reduz código duplicado.
  - Garante consistência nas regras de autorização.
  - Facilita manutenção e futuras alterações nas regras de ownership.
  - Melhora a legibilidade do código dos endpoints, delegando a lógica de autorização para helpers específicos.
- Negativas
  - Requer disciplina para utilizar os helpers em todos os endpoints relevantes.
  - Pode aumentar a complexidade inicial da implementação, mas traz benefícios a longo prazo.

### ADR-018 - Upload de arquivos via multipart/form-data

**Status:**

- Aceita

**Contexto:**
O sistema precisa suportar envio de arquivos (imagens de perfil e possivelmente futuras imagens de receitas) junto com dados textuais estruturados.

JSON puro não é suficiente para upload de arquivos binários.

**Decisão:**
Utilizar multipart/form-data para endpoints que envolvem upload de arquivos, especialmente:

PATCH /users/me (avatar)
futuros endpoints de upload de mídia

**Consequências:**

- Positivas
  - Suporte nativo a upload de arquivos no HTTP
  - Compatível com browsers e clientes mobile
  - Flexível para expansão futura
- Negativas
  - Parsing mais complexo no backend
  - Necessidade de middleware (ex: multer)
  - Validação híbrida (arquivo + body)

### ADR-019 - Separação entre Auth Context e User Resource

**Status:**

- Aceita

**Contexto:**
Existem dois endpoints retornando dados do usuário autenticado:

/auth/me (contexto de sessão)
/users/me (contexto de perfil)

Isso pode gerar ambiguidade sobre responsabilidade de cada módulo.

**Decisão:**
Manter separação semântica:

/auth/* >> responsabilidades de autenticação e sessão
login
register
me (session snapshot)
/users/* >> gerenciamento de recurso usuário
atualização de perfil
preferências
dados estendidos

**Consequências:**

- Positivas
  - Separação clara de domínio (Auth vs User Management)
  - Facilita evolução para OAuth / refresh token
  - Reduz acoplamento semântico
- Negativas
  - Dois endpoints retornando parcialmente dados similares
  - Potencial redundância de DTOs

## Histórico

| ADR     | Título                                                         | Status |
| ------- | -------------------------------------------------------------- | ------ |
| ADR-001 | Arquitetura Cliente-Servidor                                   | Aceita |
| ADR-002 | Backend em Node.js com TypeScript                              | Aceita |
| ADR-003 | Utilização do Prisma ORM                                       | Aceita |
| ADR-004 | PostgreSQL como Banco Principal                                | Aceita |
| ADR-005 | Armazenamento de Imagens por Upload                            | Aceita |
| ADR-006 | Autenticação JWT                                               | Aceita |
| ADR-007 | Controle de Acesso por Papéis (RBAC)                           | Aceita |
| ADR-008 | Promoção de Administradores Fora da API                        | Aceita |
| ADR-009 | Moderação de Conteúdo                                          | Aceita |
| ADR-010 | Ingredientes como Entidades Independentes                      | Aceita |
| ADR-011 | Sistema Smash/Pass                                             | Aceita |
| ADR-012 | Undo da Última Interação                                       | Aceita |
| ADR-013 | Documentação como Parte da Entrega                             | Aceita |
| ADR-014 | Exclusão de Usuários Remove Conteúdo Associado                 | Aceita |
| ADR-015 | Dashboard baseado em agregações                                | Aceita |
| ADR-016 | Swagger como documentação operacional da API                   | Aceita |
| ADR-017 | Centralização das regras de ownership em helpers reutilizáveis | Aceita |
| ADR-018 | Upload de arquivos via multipart/form-data | Aceita |
| ADR-019 | Separação entre Auth Context e User Resource | Aceita |
