# TCC 2

## Execução

1. Baixar o **Node > v20.10.0** [aqui](https://nodejs.org/en/download)

2. Na pasta _frontend_ baixar as dependências usando NPM: ```npm install```

3. Baixar o Docker [aqui](https://docs.docker.com/get-docker/)

4. Na raiz do projeto, usar o docker compose para instanciar os containeres: ```docker compose up```

Frontend: [localhost:3000](localhost:3000)

Backend: [localhost:8000/api](localhost:8000/api)

5. Criar um super usuário no Django:
```docker exec -it Backend /bin/bash```
```python chatbotApi/manage.py createsuperuser```

6. PRONTO!