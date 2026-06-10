
# Regras de Negócio

## Receitas

- Apenas receitas com status `APPROVED` podem aparecer no Swipe.
- Apenas o autor da receita ou administradores podem editá-la.
- Apenas o autor da receita ou administradores podem excluí-la.

## Comentários

- Apenas o autor ou administradores podem editar comentários.
- Apenas o autor ou administradores podem excluir comentários.

## Categorias e Ingredientes

- Usuários podem sugerir novos registros.
- Todo registro criado por usuário inicia com status `PENDING`.
- Apenas administradores podem aprovar ou rejeitar registros.

## Swipe

- Receitas incompatíveis com alergias do usuário não devem ser exibidas.
- Receitas ainda não avaliadas possuem prioridade máxima.
- Receitas previamente avaliadas podem voltar a ser exibidas caso não existam receitas inéditas disponíveis.
- O usuário pode desfazer sua última interação.

## Administração

- Usuários administradores são promovidos diretamente via banco de dados.
- Não existe endpoint para promoção de usuários a administrador.

## Dashboard

As métricas devem ser calculadas através de agregações sobre os dados existentes, não sendo necessária uma entidade específica para dashboard.
