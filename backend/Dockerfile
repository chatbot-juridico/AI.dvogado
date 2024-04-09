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

# Execute os comandos makemigrations, migrate e runserver
CMD python chatbotApi/manage.py makemigrations && python chatbotApi/manage.py migrate && python chatbotApi/manage.py runserver 0.0.0.0:8000