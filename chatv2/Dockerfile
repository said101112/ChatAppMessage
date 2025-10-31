# Utiliser Node.js
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer Angular CLI globalement
RUN npm install -g @angular/cli

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances locales
RUN npm install

# Copier le reste du projet
COPY . .


EXPOSE 4200


CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
