FROM node:12 AS dev
WORKDIR /usr/src/app
RUN npm i -g typeorm

ENV NODE_ENV=development
CMD typeorm migration:run && npm run dev

FROM dev AS prod
COPY package*.json ./
RUN npm install
ENV NODE_ENV=production
COPY . .

# need to build in the CMD, because assets are bind mounted and served by nginx instead
CMD npm run build && typeorm migration:run && node src/app.js
