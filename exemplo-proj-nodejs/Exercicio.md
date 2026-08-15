Objetivo

O objetivo deste trabalho é consolidar o uso do framework Express com TypeScript e aplicar os conceitos de separação de responsabilidades (camadas). Vocês partirão do código desenvolvido em sala de aula (CRUD de Tarefas em um único arquivo) e deverão refatorar a arquitetura da aplicação, além de finalizar as operações pendentes.


A API deve expor e garantir o funcionamento das seguintes rotas:

    GET /api/tarefas: Listar todas as tarefas.

    GET /api/tarefas/:id: Buscar uma tarefa específica.

    POST /api/tarefas: Cadastrar uma nova tarefa.

    PUT /api/tarefas/:id: Atualizar dados de uma tarefa existente (ex: marcar como concluída ou alterar o título).

    DELETE /api/tarefas/:id: Remover uma tarefa da lista.


Estrutura de Dados e Tipagem

O projeto deve ser construído em TypeScript. A interface da entidade Tarefa deve conter, no mínimo:

    id (number ou string)

    titulo (string)

    descricao (string - opcional)

    concluida (boolean)

Padrões HTTP e Ferramental

    Trate corretamente os Status Codes (ex: 201 Created para a criação, 204 No Content para a exclusão bem-sucedida, 404 Not Found quando buscar ou tentar deletar um ID inexistente).


Exercício Prático: Expansão de Domínio e Regras de Negócio

Objetivo: Fixar os conceitos de Clean Architecture, Injeção de Dependências e separação de responsabilidades criando um novo fluxo completo e estabelecendo relacionamentos entre entidades.

1. O Cenário

A nossa API de Tarefas foi um sucesso. Agora, o cliente solicitou uma evolução: os usuários precisam conseguir organizar suas tarefas em Categorias (ex: "Trabalho", "Faculdade", "Casa"). Além disso, o sistema precisa garantir a integridade dos dados, impedindo que categorias que já possuam tarefas vinculadas sejam excluídas acidentalmente.

2. Requisitos Técnicos
Passo 1: O Novo Domínio (Entidade)

Crie a entidade Categoria na pasta correta. Ela deve possuir a seguinte estrutura:

    id: number

    nome: string (ex: "Faculdade")

    cor: string (ex: "#FF0000")

Atualize também a entidade Tarefa para que ela passe a aceitar um campo opcional categoriaId (number).

Passo 2: O Fluxo da Categoria (O Desafio da Memória Muscular)

Vocês devem implementar o CRUD completo para Categorias, respeitando rigorosamente a divisão em 5 camadas que aprendemos. Isso significa criar:

    O Contrato: ICategoriaRepository.

    A Implementação: CategoriaRepositoryInMemory (na pasta de infraestrutura).

    A Regra de Negócio: CategoriaService (com seus respectivos DTOs).

    A Interface de Entrada: CategoriaController (obrigatoriamente dentro da pasta interfaces/controllers).

    A Fábrica e Rota: CategoriaFactory e o arquivo categorias.routes.ts.

Passo 3: Implementação de Regras de Negócio (Services)

A camada de serviço não serve apenas para repassar dados. Implementem as seguintes regras:

    No CategoriaService: Não deve ser possível criar duas categorias com o mesmo nome. (Dica: o repositório precisará de um método buscarPorNome).

    No TarefaService: Ao criar ou atualizar uma Tarefa enviando um categoriaId, o serviço de tarefas deve validar se essa categoria realmente existe. (Dica: O TarefaService precisará receber o ICategoriaRepository via injeção de dependência no construtor para fazer essa checagem).

    No CategoriaService: [Desafio] Ao tentar excluir uma categoria, o sistema deve verificar se existem tarefas vinculadas a ela. Se houver, a exclusão deve ser bloqueada e um erro de regra de negócio deve ser retornado (exigindo um Status Code 400 Bad Request no Controller).