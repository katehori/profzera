FROM node:20

WORKDIR /usr/profzera-app

COPY package*.json ./

RUN npm install

COPY . .

ARG POSTGRES_URL

ENV POSTGRES_URL=$POSTGRES_URL

RUN echo "DB_URL=${POSTGRES_URL}" > .env

RUN npm install -g pnpm

EXPOSE 8080

CMD ["npm", "run", "dev"]