FROM node:14.17.6

WORKDIR /home/node/app

COPY package*.json ./

RUN npm set strict-ssl false

RUN npm i

COPY . .
