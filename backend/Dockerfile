# Use a imagem oficial do Python como base
FROM python:3.9

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo requirements.txt para o contêiner
COPY requirements.txt .

# Instale as dependências do Django
RUN pip install -r requirements.txt

# Copie o restante do código para o contêiner
COPY . .

# Define Variaveis de ambiente
ENV AWS_ACCESS_KEY_ID='AKIA6LSQOPOU3HDWSENM'
ENV AWS_SECRET_ACCESS_KEY=''
ENV AWS_DEFAULT_REGION='sa-east-1'

# Execute os comandos makemigrations, migrate e runserver
CMD python chatbotApi/manage.py makemigrations &&  python chatbotApi/manage.py makemigrations chats feedbacks && python chatbotApi/manage.py migrate && python chatbotApi/manage.py runserver 0.0.0.0:8000