const { mockRequest, mockResponse } = require('../utils/expressMocks');
const Post = require('../../../models/Post');
const knex = require('knex');

jest.mock('knex', () => {
  const mockKnex = jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis()
  }));
  return mockKnex;
});

describe('Model', () => {
  let postModel;
  let mockDb;

  beforeEach(() => {
    mockDb = knex();
    postModel = new Post(mockDb);
    jest.clearAllMocks();
  });

  // GET /posts
  describe('getAllPosts()', () => {
    it('Deve retornar posts públicos (alunos), com campos específicos', async () => {
      const mockPosts = [{
        id: 1,
        title: 'Título',
        author: 'Prof. Nome e Sobrenome',
        created_at: new Date().toISOString()
      }];

      mockDb.where.mockReturnThis();
      mockDb.select.mockResolvedValue(mockPosts);

      const result = await postModel.getAllPosts();

      expect(mockDb).toHaveBeenCalledWith('posts');
      expect(mockDb.where).toHaveBeenCalledWith('is_published', true);
      expect(mockDb.select).toHaveBeenCalledWith('id', 'title', 'author', 'created_at');
      expect(result).toEqual(mockPosts);
    });
  });

  // POST /posts
  describe('createPost()', () => {
    it('Deve criar post com dados válidos', async () => {
      const newPost = {
        title: 'Novo Post',
        content: 'Conteúdo detalhado...',
        author: 'Prof. Nome e Sobrenome'
      };

      mockDb.insert.mockReturnThis();
      mockDb.returning.mockResolvedValue([{
        ...newPost,
        id: 1
      }]);

      const result = await postModel.createPost(newPost);

      expect(mockDb.insert).toHaveBeenCalledWith({
        title: newPost.title,
        content: newPost.content,
        author: newPost.author
      });
      expect(result).toHaveProperty('id');
      expect(result.title).toBe(newPost.title);
    });
  });

  // GET /posts/:id
  describe('getPostById()', () => {
    it('Deve retornar null para ID inexistente', async () => {
      mockDb.where.mockReturnThis();
      mockDb.first.mockResolvedValue(null);

      const result = await postModel.getPostById(999);
      
      expect(result).toBeNull();
      expect(mockDb.where).toHaveBeenCalledWith({
        id: 999,
        is_published: true
      });
    });
  });

  // PUT /posts/:id
  describe('updatePost()', () => {
    it('Deve atualizar apenas campos permitidos', async () => {
      const updates = {
        title: 'Título atualizado',
        invalidField: 'X'
      };

      mockDb.where.mockReturnThis();
      mockDb.update.mockReturnThis();
      mockDb.returning.mockResolvedValue([{
        id: 1,
        title: updates.title
      }]);

      const result = await postModel.update(1, updates);

      expect(mockDb.update).toHaveBeenCalledWith({
        title: updates.title,
        content: undefined, // Campo não enviado
        updated_at: expect.any(String)
      });
      expect(result).not.toHaveProperty('invalidField');
    });
  });

  // DELETE /posts/:id
  describe('deletePost()', () => {
    it('Deve retornar true quando excluí com sucesso', async () => {
      mockDb.where.mockReturnThis();
      mockDb.del.mockResolvedValue(1);

      const result = await postModel.deletePost(1);
      expect(result).toBe(true);
    });
  });

  // GET /posts/search
  describe('searchPosts()', () => {
    it('Deve buscar por termo no título ou conteúdo', async () => {
      const term = 'Node';

      mockDb.where.mockReturnThis();
      mockDb.andWhere.mockReturnThis();
      mockDb.orWhere.mockReturnThis();
      mockDb.select.mockResolvedValue([{
        id: 1,
        title: 'Título da busca por termo'
      }]);

      await postModel.searchPosts(term);

      expect(mockDb.orWhere).toHaveBeenCalledWith(
        'content', 'ilike', `%${term}%`
      );
    });
  });
});