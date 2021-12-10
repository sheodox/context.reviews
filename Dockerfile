FROM node:16 AS dev
WORKDIR /usr/src/app

ENV NODE_ENV=development
COPY package*.json ./
# need to install dependencies so different distros other than ubuntu can be used on the host machine 
RUN npm install
COPY prisma prisma
RUN npx prisma generate
CMD npm run dev


FROM dev AS prod
ENV NODE_ENV=production
COPY . .
RUN npm run build:prod
RUN node extra-build.js production

# before starting, copy all of the newly built frontend assets to the folder nginx serves
CMD cp -R ./public-dist/* ./public && npx prisma migrate deploy && node dist/server/app.js

