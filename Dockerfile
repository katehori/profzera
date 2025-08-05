FROM node:20

WORKDIR /usr/profzera-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g pnpm

EXPOSE 8080

CMD ["npm", "run", "dev"]