FROM node:18
WORKDIR /app
RUN npm install -g prisma
COPY package.json /app
COPY package-lock.json /app
RUN npm i
COPY prisma /app/prisma
RUN prisma generate
RUN prisma db push
COPY . /app
RUN npm run build
CMD [ "node", "dist/main.js" ]