const { mockRequest, mockResponse, mockNext } = require('../utils/expressMocks');
const PostController = require('../../../controllers/postController');
const knex = require('knex');

jest.mock('knex', () => jest.fn(() => ({
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis()
})));

describe('Controller', () => {
  let controller;
  let req, res, next;

  beforeEach(() => {
    const mockDb = knex();

    controller = new PostController(mockDb);
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
    jest.clearAllMocks();
  });

  // Criação de um post
  describe('createPost()', () => {
    it('Deve criar um post com dados válidos (status 201)', async () => {
      req.body = {
        title: 'Título da criação de post',
        content: 'Conteúdo da criação de post'
      };
      req.user = {
          name: 'Prof. Nome e Sobrenome',
          role: 'teacher'
      };

      knex().insert.mockResolvedValue([{
        id: 1,
        ...req.body,
        author: req.user.name
      }]);

      await controller.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: req.body.title,
        author: req.user.name
      }));
    });

    it('Deve bloquear a criação de um post sem autenticação (status 401)', async () => {
      req.user = null;
      await controller.createPost(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  // Leitura de um post
  describe('getPost()', () => {
    it('Deve retornar um post existente (status 200)', async () => {
      req.params = { id: 1 };
      const mockPost = {
        id: 1,
        title: 'Título do post existente',
        content: 'Conteúdo do post existente',
        is_published: true
      };

      knex().where.mockReturnThis();
      knex().first.mockResolvedValue(mockPost);

      await controller.getPost(req, res);

      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('Deve retornar o status 404 para um post inexistente', async () => {
      req.params = { id: 999 };
      knex().first.mockResolvedValue(null);

      await controller.getPost(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // Atualização de um post
  describe('updatePost()', () => {
    it('Deve atualizar um post com dados válidos (status 200)', async () => {
      req.params = { id: 1 };
      req.body = { title: 'Título do post atualizado' };
      req.user = { role: 'teacher' };

      knex().update.mockReturnThis();
      knex().returning.mockResolvedValue([{
        id: 1,
        title: req.body.title,
        updated_at: new Date().toISOString()
      }]);

      await controller.updatePost(req, res);

      expect(knex().update).toHaveBeenCalledWith({
        title: req.body.title,
        updated_at: expect.any(String)
      });
      expect(res.json).toHaveBeenCalled();
    });
  });

  // Exclusão de um post 4. DELETE
  describe('deletePost()', () => {
    it('Deve deletar um post existente (status 204)', async () => {
      req.params = { id: 1 };
      req.user = { role: 'teacher' };
      knex().del.mockResolvedValue(1);

      await controller.deletePost(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  // Busca por termo no título ou conteúdo
  describe('searchPosts()', () => {
    it('Deve retornar os resultados da busca com o termo válido (status 200)', async () => {
      req.query = { term: 'busca' };
      const mockResults = [
        { id: 1, title: 'Título da busca' }
      ];

      knex().where.mockReturnThis();
      knex().andWhere.mockReturnThis();
      knex().orWhere.mockReturnThis();
      knex().select.mockResolvedValue(mockResults);

      await controller.searchPosts(req, res);
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    it('Deve retornar o status 400 para a busca sem termo', async () => {
      req.query = {};
      await controller.searchPosts(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // Listagem de todos os posts (ADMIN - Professores)
  describe('listAllPosts()', () => {
    it('Deve retornar todos os posts para ADMIN (status 200)', async () => {
      req.user = { role: 'admin' };
      knex().select.mockResolvedValue([
        { id: 1, title: 'Post 1', is_published: true },
        { id: 2, title: 'Post 2', is_published: false }
      ]);

      await controller.listAllPosts(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: expect.any(Number) })
      ]));
    });
  });
});