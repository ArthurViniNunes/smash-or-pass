# Guia de desenvolvimento com Docker Compose

Siga o [passo a passo de instalação](../README-ptbr.md#trabalho-2--docker-compose)
para criar o arquivo de configuração e iniciar a stack. Este guia explica
como manter e diagnosticar a execução do Trabalho 2.

## Serviços e dependências

| Serviço | Responsabilidade | Dependências na partida |
| --- | --- | --- |
| `postgres` | Dados relacionais da aplicação | Volume `postgres-data` |
| `minio` | Objetos compatíveis com S3 | Volume `minio-data` |
| `minio-init` | Cria o bucket `recipe-images` e habilita a leitura anônima | MinIO acessível |
| `rabbitmq` | Fila de processamento de imagens | Volume `rabbitmq-data` |
| `backend` | API Express e migrations do Prisma | PostgreSQL e RabbitMQ saudáveis, inicialização do MinIO concluída |
| `image-worker` | Processamento de imagens com Sharp | Backend saudável |
| `frontend` | Aplicação Next.js | Compilado com `NEXT_PUBLIC_API_URL=/api` |
| `nginx` | Entrada HTTP para a interface, a API e as imagens | Frontend e backend saudáveis |

O Compose publica apenas a porta HTTP do Nginx. Os demais serviços se
comunicam pelos nomes da tabela na rede `application`. O DynamoDB fica na
AWS e recebe os eventos de auditoria do backend.

## Como os dados circulam

- **API e banco.** O navegador chama `/api/` no mesmo endereço da interface.
  O Nginx remove esse prefixo ao encaminhar ao backend. O Prisma conecta ao
  host `postgres` e lê ou escreve no banco `smash_or_pass`.
- **Upload e leitura.** O backend envia o objeto ao MinIO pelo SDK S3. Na
  configuração do Compose, `STORAGE_PROVIDER=s3` seleciona o protocolo e
  `MINIO_ENDPOINT` aponta para o servidor interno. A aplicação resolve
  `/media/smash-or-pass/…` como `/api/media/smash-or-pass/…` no navegador.
  O Nginx encaminha apenas leitura nesse caminho para o bucket.
- **Processamento.** Após gravar o objeto, o backend publica uma mensagem
  persistente na fila `image-processing` e espera confirmação do broker.
  O worker lê e processa o objeto e confirma a mensagem depois da gravação.
  Objetos marcados como processados são ignorados em reentregas. Falhas
  repetidas vão para `image-processing-failed`.
- **Auditoria.** O backend registra ações de CRUD no DynamoDB após a resposta
  HTTP. Uma requisição bem-sucedida pode coexistir com uma falha de
  auditoria. Confira os logs e consulte a tabela para validar a gravação.

## Configuração e alterações

- Copie [o exemplo](../.env.compose.example) para `.env.compose`. Esse
  arquivo configura tanto o Compose quanto o backend e fica fora do Git.
- Mantenha `DATABASE_URL` e `DIRECT_URL` alinhadas com
  `POSTGRES_PASSWORD`. Mantenha `RABBITMQ_URL` alinhada com
  `RABBITMQ_PASSWORD`. Use percent-encoding para caracteres reservados
  nas senhas incluídas em URLs. As senhas de bootstrap do PostgreSQL e do
  RabbitMQ são aplicadas ao inicializar um volume novo.
- Se renomear o bucket, altere `AWS_S3_BUCKET`, o comando de inicialização
  em [compose.yml](../compose.yml) e o destino em [nginx.conf](../deploy/nginx.conf).
- Para aplicar mudanças de código ou dependências, rode novamente
  `docker compose --env-file .env.compose up --build -d`. Faça o mesmo
  depois de adicionar migrations. O worker usa a imagem do backend.
- Para parar a stack preservando dados, rode
  `docker compose --env-file .env.compose down`. A opção `-v` apaga os
  volumes do banco, dos objetos e da fila. O seed também apaga os dados
  relacionais existentes antes de preencher o banco com exemplos.

## Diagnóstico

Execute os comandos a partir da raiz do repositório.

```sh
docker compose --env-file .env.compose config -q
docker compose --env-file .env.compose ps -a
docker compose --env-file .env.compose logs --tail 100 backend image-worker minio-init
curl -f http://localhost/health
```

| Sintoma | O que verificar |
| --- | --- |
| `minio-init` aparece como `Exited (0)` | Esse serviço termina após preparar o bucket. Código zero indica sucesso. |
| Backend aguardando ou reiniciando | Confira os logs do PostgreSQL, do RabbitMQ e do inicializador do MinIO. Depois, verifique as URLs e os erros das migrations. |
| Interface abre, mas a imagem retorna 403 ou 404 | Confirme o caminho `/api/media/`, o nome do bucket no Nginx e a saída de `minio-init`. Imagens antigas podem apontar para objetos do S3 que precisam ser restaurados separadamente. |
| Imagem abre, mas o processamento falha | Confira os logs do worker e liste as filas com `docker compose --env-file .env.compose exec rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged`. |
| DynamoDB retorna `ExpiredTokenException` | Renove as credenciais temporárias no ambiente local e recrie os containers que leem o arquivo. Confira também a região, o nome da tabela e a permissão de gravação. |
| A porta 80 já está ocupada | Confira o serviço que usa a porta ou ajuste a porta publicada do Nginx e o endereço de acesso em `CORS_ORIGINS`. |

Para revisar uma alteração, use o [roteiro de verificação](../README-ptbr.md#verificação-para-a-entrega).
A [arquitetura AWS do Trabalho 1](aws-services-architecture.md) registra o
desenho anterior para consulta histórica.
