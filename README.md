# Documentação técnica - Profzera API

O ProfZera é um blog moderno e descomplicado para alunos e professores da rede pública que querem dominar os conteúdos escolares de um jeito prático e digital! 📱💻

## 📚 Profzera API

**API para gestão de posts de conteúdos educacionais**  

### Pré-requisitos

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue?logo=postgresql)](https://www.postgresql.org/)

---

## 🚀 Índice
1. [Pré-requisitos](#-pre-requisitos)
2. [Arquitetura](#-arquitetura-da-aplicação)
3. [Endpoints](#-endpoints)
4. [Variáveis de Ambiente](#-variáveis-de-ambiente)
5. [Testes](#-testes)
6. [Deploy](#-deploy)
7. [Contribuição](#-contribuição)
8. [Licença](#-licença)
9. [Recursos](#-recursos)

---

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/en/download/)
- [PostgreSQL 13+](https://www.postgresql.org/download/)
- [Docker](https://docs.docker.com/get-docker/)

### Instalação
```bash
# clone o repositório
git clone https://github.com/seu-usuario/profzera-backend.git
cd profzera-backend

# instale as dependências
npm install

# configure o ambiente
cp .env.example .env
```

### Banco de Dados

```bash
# com Docker:
docker-compose up -d postgresdb

# ou manualmente:
npx knex migrate:latest
npx knex seed:run
```

### Variáveis de ambiente (.env)

Crie um arquivo .env baseado no .env.example:
```ini
NODE_ENV=development
PORT=3000

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=profzera_db

# Autenticação
JWT_SECRET=secret
JWT_EXPIRES_IN=1d
```


### Arquitetura da aplicação

```
src/
├── config/          # Configurações globais
├── controllers/     # Lógica das rotas
├── models/          # Camada de dados
├── routes/          # Definição de rotas
├── middlewares/     # Autenticação/validação
├── utils/           # Helpers compartilhados
└── app.js           # App principal
```

### Tecnologias

#### Pricipais

| Recurso    | Descrição                  | Link                             |
|------------|----------------------------|----------------------------------|
| Node.js    | Runtime JavaScript         | https://nodejs.org/en/docs       |
| Express    | Framework web para Node.js | https://expressjs.com/           |
| PostgreSQL | Banco de dados relacional  | https://www.postgresql.org/docs/ |

#### Ferramentas de desenvolvimento

| Recurso        | Descrição                     | Link                             |
|----------------|-------------------------------|----------------------------------|
| Knex.js        | Query Builder para PostgreSQL | https://knexjs.org/              |
| Docker         | Conteinerização               | https://docs.docker.com/         |
| Docker Compose | Orquestração de containers    | https://docs.docker.com/compose/ |

#### Autenticação e segurança

| Recurso               | Descrição                              | Link                                 |
|-----------------------|----------------------------------------|--------------------------------------|
| JSON Web Tokens (JWT) | Autenticação stateless                 | https://jwt.io/introduction          |
| Bcrypt                | Hash de senhas                         | https://www.npmjs.com/package/bcrypt |
| Dotenv                | Gerenciamento de variáveis de ambiente | https://www.npmjs.com/package/dotenv |

#### Testes

| Recurso   | Descrição                              | Link                                    |
|-----------|----------------------------------------|-----------------------------------------|
| Jest      | Framework de testes                    | https://jestjs.io/docs/getting-started  |
| Supertest | Testes de integração HTTP              | https://www.npmjs.com/package/supertest |
| Dotenv    | Gerenciamento de variáveis de ambiente | https://www.npmjs.com/package/dotenv    |

#### Documentação

| Recurso    | Descrição                              | Link                                 |
|------------|----------------------------------------|--------------------------------------|
| Swagger UI | Documentação interativa de APIs        | https://swagger.io/tools/swagger-ui/ |
| OpenAPI    | Especificação de APIs                  | https://www.openapis.org/            |
| Dotenv     | Gerenciamento de variáveis de ambiente | https://www.npmjs.com/package/dotenv |

#### Ferramentas auxiliares

| Recurso | Descrição           | Link                     |
|---------|---------------------|--------------------------|
| Postman | Teste de APIs       | https://www.postman.com/ |
| Render  | Hospedagem em cloud | https://render.com/docs  |
| Git     | Controle de versão  | https://git-scm.com/doc  |

#### Recursos específicos

**Migrations**

[Knex Migrations](https://knexjs.org/guide/migrations.html)

**Configuração do Jest**

[Jest Configuration](https://jestjs.io/docs/configuration)

**Autenticação JWT**

[jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)


### Guia de uso das APIs

#### Endpoints

| Método      | Rota                | Descrição                                 | Autenticação  |
|-------------|---------------------|------------------------------------------ |---------------|
| GET         | /posts              | Lista posts públicos (alunos)             | ❌            |
| GET         | /posts/:id          | Detalhes de um post                       | ❌            |
| POST        | /posts              | Cria um novo post                         | Professor     |
| PUT         | /posts/:id          | Atualiza um post                          | Professor     |
| DELETE      | /posts/:id          | Excluí um post                            | Professor     |
| GET         | /posts/search?term= | Busca por termo no título ou conteúdo     | ❌            | 

#### Exemplo de Request - Criação de um post

```http
POST /api/posts  
Authorization: Bearer <token>  
Content-Type: application/json  

{ "title": "Título do post", "content": "..." }  
```

### Exemplo de Response - Criação de um post (status 201)

```json
{  
  "id": 1,  
  "title": "Título do post",  
  "author": "Prof. Nome e Sobrenome",  
  "created_at": "2023-08-20T10:00:00Z"  
}  
```

🔗 [Documentação completa no Swagger UI](http://localhost:3000/api-docs)

### Testes

```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testar um arquivo específico
npm test -- PostController.test.js
```

### Contribuição

1. Faça um fork do projeto
2. Crie sua branch `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças `git commit -m 'Mensagem descrevendo a nova funcionalidade'`
4. Push para a branch `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request
