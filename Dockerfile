FROM node:12 AS dev
WORKDIR /usr/src/app
RUN npm i -g typeorm
USER node

ENV NODE_ENV=development
CMD typeorm migration:run && npx nodemon src/app.js

FROM dev AS prod
COPY package*.json ./
RUN npm install
ENV NODE_ENV=production
COPY . .
RUN npm run build
CMD typeorm migration:run && node src/app.js
