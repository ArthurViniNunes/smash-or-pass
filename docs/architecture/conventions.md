
# Convenções Arquiteturais

## Chaves primárias

Todas as entidades utilizam UUID como chave primária.

## Auditoria

As entidades principais armazenam campos de auditoria:

- createdAt
- updatedAt

## Aprovação de conteúdo

As entidades sujeitas à moderação utilizam o fluxo:

- PENDING
- APPROVED
- REJECTED

## Controle de acesso

O sistema utiliza RBAC (Role-Based Access Control), com os papéis:

- USER
- ADMIN
