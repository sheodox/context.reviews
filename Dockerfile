FROM node:12 AS setup
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i -g typeorm
RUN npm install

FROM setup as dev
ENV NODE_ENV=development
CMD typeorm migration:run && npx nodemon src/app.js

FROM setup AS prod
ENV NODE_ENV=production
COPY . .
RUN npm run build
CMD typeorm migration:run && node src/app.js
