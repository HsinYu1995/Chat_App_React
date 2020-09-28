FROM node:12.16.1-alpine

WORKDIR /chat

COPY package.json .
COPY package-lock.json .

RUN npm install --silent


COPY . .

CMD ["npm", "start"]