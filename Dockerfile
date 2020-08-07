FROM node:12 AS setup
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM setup AS prod
ENV NODE_ENV=production
COPY . .
RUN npm run build
CMD ["node", "app"]

FROM setup as dev
ENV NODE_ENV=development
CMD ["npx", "nodemon", "app.js"]