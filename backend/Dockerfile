FROM node:12.16.1-alpine
WORKDIR /chat

COPY package.json /chat
COPY package-lock.json /chat

RUN npm install

COPY . .

EXPOSE 5002

CMD ["npm", "start"]