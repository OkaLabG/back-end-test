# Teste Técnico Desenvolvedor(a) Back End Júnior

## Problema

A DevSys é uma empresa de tecnologia, nela se encontram vários colaboradores de diferentes setores. O setor administrativo, juntamente com o RH, necessitam de uma ferramenta que possa organizar e gerenciar as férias dos colaboradores da empresa.

## Solução

Para ajudar o setor administrativo, você deve desenvolver uma API REST onde o time de Front-end possa produzir uma interface dispondo todas as informações necessárias para organizar as férias dos funcionários.

### Algumas orientações para o funcionamento da regra de negócio

1. Cada setor da empresa possui no mínimo um colaborador responsável (Coordenador, gerente, etc) por toda a equipe.
2. Nenhum setor pode ficar sem um responsável nas férias de alguém.
3. Nenhum setor pode realizar férias coletivas (Todos do setor).
4. Sempre deve haver mão de obra disponível em todos os setores, contendo pelo menos 2 pessoas disponíveis (contando com o responsável).

## Recomendações

- Utilizar o framework [Nest.js](https://docs.nestjs.com/).
- Usar o [Redis](https://redis.io/) como complemento da aplicação.
- Usar o [Docker](https://docs.docker.com/) e implementar o Docker Compose na aplicação.
- Utilizar [MongoDB](https://www.mongodb.com) como seu banco principal.
- ORM será o [TypeOrm](https://typeorm.io/) para o app.
- Utilizar um serviço de e-mail para enviar relatórios e notificações para os colaboradores e para o setor administrativo.
- Realizar testes automatizados nas principais rotas ([Jest](https://jestjs.io/pt-BR/)).

### Atenção

Ao terminar o teste, solicite um pull request.

Em caso de dúvidas, envie e-mail para reinaldo@imobpower.com.

**Boa sorte!**
