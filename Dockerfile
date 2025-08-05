FROM node:20-alpine

WORKDIR /usr/profzera-app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 8080

CMD ["npm", "start"]