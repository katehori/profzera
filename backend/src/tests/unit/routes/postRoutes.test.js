const request = require('supertest');
const express = require('express');
const knex = require('knex');
const postRoutes = require('../../../routes/postRoutes');
const { mockRequest, mockResponse } = require('../utils/expressMocks');

jest.mock('knex', () => jest.fn(() => ({
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis()
})));

jest.mock('../../../middlewares/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { id: 1, name: 'Prof. Nome e Sobrenome', role: 'teacher' };
    next();
  }),
  authorize: (role) => (req, res, next) => next()
}));

describe('Routes', () => {
  let app;
  let mockDb;

  beforeAll(() => {
    mockDb = knex();
    app = express();
    app.use(express.json());
    app.use('/posts', postRoutes(mockDb));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /posts
  describe('GET /posts', () => {
    it('Deve retornar o status 200 com a lista de posts', async () => {
      mockDb.select.mockResolvedValue([
        { id: 1, title: 'Post 1', author: 'Prof. A' },
        { id: 2, title: 'Post 2', author: 'Prof. B' }
      ]);

      const response = await request(app)
        .get('/posts')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(mockDb.where).toHaveBeenCalledWith('is_published', true);
    });
  });

  // GET /posts/:id
  describe('GET /posts/:id', () => {
    it('Deve retornar o status 200 para um post existente', async () => {
      mockDb.first.mockResolvedValue({
        id: 1,
        title: 'Post existente',
        content: 'Conteúdo detalhado...'
      });

      const response = await request(app)
        .get('/posts/1')
        .expect(200);

      expect(response.body).toHaveProperty('title');
    });

    it('Deve retornar o status 404 para um post inexistente', async () => {
      mockDb.first.mockResolvedValue(null);
      await request(app).get('/posts/999').expect(404);
    });
  });

  // POST /posts
  describe('POST /posts', () => {
    it('Deve criar um post com autenticação (status 201)', async () => {
      const newPost = {
        title: 'Novo post',
        content: 'Conteúdo do post...'
      };

      mockDb.insert.mockResolvedValue([{ ...newPost, id: 1 }]);

      const response = await request(app)
        .post('/posts')
        .set('Authorization', 'Bearer valid-token')
        .send(newPost)
        .expect(201);

      expect(response.body).toMatchObject(newPost);
    });

    it('Deve retornar o status 400 para dados inválidos', async () => {
      await request(app)
        .post('/posts')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: '' })
        .expect(400);
    });
  });

  // PUT /posts/:id
  describe('PUT /posts/:id', () => {
    it('Deve atualizar um post existente (status 200)', async () => {
      const updates = { title: 'Título Atualizado' };
      mockDb.update.mockResolvedValue(1);

      await request(app)
        .put('/posts/1')
        .set('Authorization', 'Bearer valid-token')
        .send(updates)
        .expect(200);
    });
  });

  // DELETE /posts/:id
  describe('DELETE /posts/:id', () => {
    it('Deve excluir o post com autenticação (status 204)', async () => {
      mockDb.del.mockResolvedValue(1);
      await request(app)
        .delete('/posts/1')
        .set('Authorization', 'Bearer valid-token')
        .expect(204);
    });
  });

  // GET /posts/search
  describe('GET /posts/search', () => {
    it('Deve buscar os posts por termo (status 200)', async () => {
      mockDb.select.mockResolvedValue([
        { id: 1, title: 'Título' }
      ]);

      const response = await request(app)
        .get('/posts/search?q=node')
        .expect(200);

      expect(response.body[0].title).toMatch(/node/i);
    });

    it('Deve retornar o status 400 sem query param', async () => {
      await request(app)
        .get('/posts/search')
        .expect(400);
    });
  });

  // GET /posts/admin/all
  describe('GET /posts/admin/all', () => {
    it('Deve retornar todos os posts para admin (status 200)', async () => {
      mockDb.select.mockResolvedValue([
        { id: 1, title: 'Post 1', is_published: true },
        { id: 2, title: 'Post 2', is_published: false }
      ]);

      const response = await request(app)
        .get('/posts/admin/all')
        .set('Authorization', 'Bearer admin-token')
        .expect(200);

      expect(response.body.some(p => !p.is_published)).toBeTruthy();
    });
  });
});