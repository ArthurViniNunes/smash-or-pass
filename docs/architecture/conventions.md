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

## Uploads e Storage

O sistema possui uma camada de abstração para gerenciamento de arquivos, baseada em `StorageService`.

### Estrutura

- Uploads são processados via `multer`
- Arquivos são armazenados através de um provider
- Implementação atual:
  - `LocalStorageProvider` (filesystem local)

### Tipos de upload

- Avatar de usuário (`avatar`)
- Imagens de receitas (`image`)

### Regras

- Todo upload gera uma URL persistida no banco (`avatarUrl` ou `imageUrl`)
- Arquivos antigos devem ser removidos ao serem substituídos
- Uploads são opcionais para entidades que não exigem imagem
- O sistema é desacoplado para futura migração para cloud storage (ex: S3)