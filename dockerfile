# Étape 1 : Construction de l'application Angular
FROM node:16 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers sources de l'application
COPY . .

# Construire l'application Angular pour la production
RUN npm run build --prod

# Étape 2 : Serveur Nginx pour l'application construite
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape précédente vers le dossier par défaut de Nginx
COPY --from=build /app/dist/nom-du-projet-angular /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
