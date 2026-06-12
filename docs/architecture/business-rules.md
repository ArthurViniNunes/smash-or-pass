
# Regras de Negócio

## Receitas

- Receitas criadas por usuários iniciam com status PENDING.
- Administradores podem criar receitas já aprovadas.
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
- Cada usuário pode possuir apenas uma interação por receita.
- Caso uma interação já exista para a receita, uma nova interação substitui a anterior.

## Administração

- Usuários administradores são promovidos diretamente via banco de dados.
- Não existe endpoint para promoção de usuários a administrador.

## Dashboard

Dashboard retorna:

- Total de usuários
- Total de receitas
- Receitas pendentes
- Receitas aprovadas
- Total de comentários
- Total de interações

(Possivelmente expandir para incluir mais métricas no futuro, conforme necessidades do frontend.)

## Deleção de Usuários

A exclusão de um usuário remove automaticamente todo conteúdo associado ao usuário.
