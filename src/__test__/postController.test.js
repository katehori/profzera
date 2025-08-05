const postController = require("../controllers/postController");
const PostModel = require("../models/Post");

jest.mock("../models/Post");

const mockRequest = {
  params: {},
  body: {},
}

const mockResponse = {
  status: jest.fn(() => mockResponse),
  json: jest.fn(),
}

describe('Get All Posts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return list of posts', async () => {
    const mockPostsInDB = []
    PostModel.getAllPosts.mockResolvedValue(mockPostsInDB)

    await postController.getAllPosts(mockRequest, mockResponse);

    expect(PostModel.getAllPosts).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPostsInDB);
  })

  it('should return error', async () => {
    PostModel.getAllPosts.mockRejectedValue(new Error())

    await postController.getAllPosts(mockRequest, mockResponse);

    expect(PostModel.getAllPosts).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro ao buscar todos os posts' });
  })
})

describe('Get Post by ID', () => {
  const mockPostInDB = { id: 1 };

  beforeEach(() => {
    mockRequest.params = { ...mockPostInDB };
  })

  it('should return the post by ID', async () => {
    PostModel.getPostById.mockResolvedValue(mockPostInDB);

    await postController.getPostById(mockRequest, mockResponse);

    expect(PostModel.getPostById).toHaveBeenCalledWith(mockPostInDB.id);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPostInDB);
  })

  it('should return not found by ID', async () => {
    PostModel.getPostById.mockResolvedValue(null);

    await postController.getPostById(mockRequest, mockResponse);

    expect(PostModel.getPostById).toHaveBeenCalledWith(mockPostInDB.id);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Post não encontrado' });
  })

  it('should return error', async () => {
    PostModel.getPostById.mockRejectedValue(new Error());

    await postController.getPostById(mockRequest, mockResponse);

    expect(PostModel.getPostById).toHaveBeenCalledWith(mockPostInDB.id);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro ao buscar post' });
  })
})

describe('Create Post', () => {
  const mockPostInDB = { id: 1 };

  beforeEach(() => {
    mockRequest.body = {
      title: 'title',
      content: 'content',
      author: 'author',
    }
  })

  it('should create a new post', async () => {
    PostModel.createPost.mockResolvedValue({ ...mockPostInDB, ...mockRequest.body });

    await postController.createPost(mockRequest, mockResponse);

    expect(PostModel.createPost).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ ...mockPostInDB, ...mockRequest.body });
  })

  //TODO Terminar testes do createPost

})

//TODO Fazer testes do updatePost e deletePostById