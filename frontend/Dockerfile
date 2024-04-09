# Use a imagem oficial do Node.js como base
FROM node:20

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o restante do código para o contêiner
COPY . .

# Instale as dependências do React
RUN npm install

# Comando para iniciar o servidor React
CMD ["npm", "start"]
