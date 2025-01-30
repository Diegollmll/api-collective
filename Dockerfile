# Usa una imagen de Node.js
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /src

# Copia archivos necesarios
COPY package.json .
COPY package-lock.json .
COPY prisma/schema.prisma ./prisma/

# Instala dependencias y Prisma Client
RUN npm install
RUN npx prisma generate

# Copia todo el proyecto y compila TypeScript
COPY . .
RUN npm run build

# Expone el puerto
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "start"]