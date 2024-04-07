FROM node:18
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "preview"]