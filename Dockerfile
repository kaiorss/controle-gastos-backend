# define a imagem base que será usada para criar o container
# neste caso, usamos uma imagem oficial do node.js na versão 20
# a versão alpine é uma versão mais leve, comum em containers
from node:20-alpine

# define a pasta de trabalho dentro do container
# todos os comandos seguintes serão executados dentro da pasta /app
workdir /app

# copia os arquivos package.json e package-lock.json para dentro do container
# esses arquivos descrevem as dependências do projeto
copy package*.json ./

# instala as dependências do projeto dentro do container
# npm install instala com base no package.json
# --omit=dev evita instalar dependências de desenvolvimento
run npm install --omit=dev

# copia todos os demais arquivos do projeto para dentro do container
# isso inclui, por exemplo, o server.js
copy . .

# define uma variável de ambiente padrão chamada PORT
# neste projeto, a aplicação usará a porta 5000 por padrão
env PORT=5000

# informa que o container utiliza a porta 5000
# atenção: expose não publica a porta automaticamente
# ele apenas documenta a porta usada pela aplicação
expose 5000

# define o comando que será executado quando o container iniciar
# neste caso, o container executará npm start
cmd ["npm", "start"]