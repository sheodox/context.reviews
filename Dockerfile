FROM node:12 AS setup
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 4000

FROM setup AS prod
COPY . .
CMD ["node", "app"]

FROM setup as dev
CMD ["npx", "nodemon", "app.js"]