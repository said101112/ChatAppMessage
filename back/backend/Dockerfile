FROM node:20-alpine AS build
WORKDIR /app

# dependessies

COPY package*.json ./

RUN npm i 

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
