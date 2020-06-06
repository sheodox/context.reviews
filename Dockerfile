FROM node:12 AS setup
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM setup AS prod
COPY . .
RUN npm run build
CMD ["node", "app"]

FROM setup as dev
CMD ["npx", "nodemon", "app.js"]