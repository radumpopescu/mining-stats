FROM alpine

RUN apk add --update nodejs nodejs-npm
RUN npm install -g npm@latest
WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm install
