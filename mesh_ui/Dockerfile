FROM node:16-alpine3.15

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /home/node/app

RUN mkdir /home/node/app/static

COPY package*.json ./

RUN npm set strict-ssl false --global

RUN npx smui-theme template src/theme

RUN npm i

COPY . .