FROM node:18
WORKDIR /app
RUN npm install -g prisma
COPY package*.json ./
RUN npm install
COPY prisma /app/prisma
RUN prisma generate
RUN prisma db push
COPY . /app
RUN npm run build
EXPOSE 3000
EXPOSE 80
CMD [ "node", "dist/src/main.js" ]
