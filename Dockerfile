FROM node:12 AS dev
WORKDIR /usr/src/app
RUN npm i -g typeorm

ENV NODE_ENV=development
CMD typeorm migration:run && npx nodemon src/app.js

FROM dev AS prod
COPY package*.json ./
RUN npm install
ENV NODE_ENV=production
COPY . .

USER node
# need to build in the CMD, because assets are bind mounted and served by nginx instead
CMD npm run build && typeorm migration:run && node src/app.js
