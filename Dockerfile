FROM node:20.10.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.2.5

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.2.5

RUN npm install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node","dist/src/main"]
