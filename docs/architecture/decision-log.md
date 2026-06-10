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

## Histórico

| ADR     | Título                                    | Status |
| ------- | ----------------------------------------- | ------ |
| ADR-001 | Arquitetura Cliente-Servidor              | Aceita |
| ADR-002 | Backend em Node.js com TypeScript         | Aceita |
| ADR-003 | Utilização do Prisma ORM                  | Aceita |
| ADR-004 | PostgreSQL como Banco Principal           | Aceita |
| ADR-005 | Armazenamento de Imagens por Upload       | Aceita |
| ADR-006 | Autenticação JWT                          | Aceita |
| ADR-007 | Controle de Acesso por Papéis (RBAC)      | Aceita |
| ADR-008 | Promoção de Administradores Fora da API   | Aceita |
| ADR-009 | Moderação de Conteúdo                     | Aceita |
| ADR-010 | Ingredientes como Entidades Independentes | Aceita |
| ADR-011 | Sistema Smash/Pass                        | Aceita |
| ADR-012 | Undo da Última Interação                  | Aceita |
| ADR-013 | Documentação como Parte da Entrega        | Aceita |
