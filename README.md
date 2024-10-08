# TCC 2

## Execução

1. Baixar o **Node > v20.10.0** [aqui](https://nodejs.org/en/download)

2. Na pasta _frontend_ baixar as dependências usando NPM:

   `npm install`

3. Baixar o Docker [aqui](https://docs.docker.com/get-docker/)

4. No Dockerfile encontrado no backend, preencha as variáveis de ambiente:
   * ENV AWS_ACCESS_KEY_ID
   * ENV AWS_SECRET_ACCESS_KEY
   * ENV AWS_DEFAULT_REGION
   De acordo com as instruções da sua conta AWS

5. Na raiz do projeto, usar o docker compose para instanciar os containeres:

   `docker compose up`

   Frontend: [localhost:3000](http://localhost:3000)

   Backend: [localhost:8000/api](http://localhost:8000/api)

6. Carregar backup do banco:

   `docker exec -it Database bash backup/backup_restore.sh`

   > Se necessário, dê permissão de administrador para a pasta **db-data** e para o arquivo **backup.sql**

   Nesse backup já tem um super usuário do Django.

7. Ao manipular o banco de dados e desejar manter as alterações, faça o backup:

   `docker exec -it Database bash backup/backup_data.sh`
