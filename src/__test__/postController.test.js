const postController = require("../controllers/postController");
const PostModel = require("../models/post");
const UserModel = require("../models/user");
const { postErrors, userErrors } = require("../constants/errorMessages");

jest.mock("../models/post");
jest.mock("../models/user");

const mockRequest = {
  params: {},
  body: {},
  query: {},
};

const mockResponse = {
  status: jest.fn(() => mockResponse),
  json: jest.fn(),
  send: jest.fn(),
};

describe('Get All Posts', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of posts', async () => {
    const mockPostsInDB = [];
    PostModel.getAllPosts.mockResolvedValue(mockPostsInDB);

    await postController.getAllPosts(mockRequest, mockResponse);

    expect(PostModel.getAllPosts).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPostsInDB);
  });

  it('should return error', async () => {
    PostModel.getAllPosts.mockRejectedValue(new Error());

    await postController.getAllPosts(mockRequest, mockResponse);

    expect(PostModel.getAllPosts).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.FIND_ALL_ERROR });
  });

});

describe('Get Post by ID', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.params = { id: 1 };
  });

  it('should return the post by ID', async () => {
    const mockPostInDB = mockRequest.params;
    PostModel.getPostById.mockResolvedValue(mockPostInDB);

    await postController.getPostById(mockRequest, mockResponse);

    expect(PostModel.getPostById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPostInDB);
  });

  it('should return not found by ID', async () => {
    PostModel.getPostById.mockResolvedValue(null);

    await postController.getPostById(mockRequest, mockResponse);

    expect(PostModel.getPostById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.NOT_FOUND });
  });

  it('should return error', async () => {
    PostModel.getPostById.mockRejectedValue(new Error());

    await postController.getPostById(mockRequest, mockResponse);

    expect(PostModel.getPostById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.FIND_BY_ID_ERROR });
  });

});

describe('Create Post', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = {
      title: 'title',
      content: 'content',
      userId: 1,
    };
  });

  it('should create a new post', async () => {
    const mockPostInDB = { id: 1 };
    UserModel.getUserById.mockResolvedValue({ id: 1 })
    PostModel.createPost.mockResolvedValue(mockPostInDB);

    await postController.createPost(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledWith(mockRequest.body.userId);
    expect(PostModel.createPost).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPostInDB);
  });

  it('should return missing create data', async () => {
    mockRequest.body = {};

    await postController.createPost(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledTimes(0);
    expect(PostModel.createPost).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.MISSING_CREATE_DATA });
  });

  it('should return user not found', async () => {
    UserModel.getUserById.mockResolvedValue(null);

    await postController.createPost(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledWith(mockRequest.body.userId);
    expect(PostModel.createPost).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.NOT_FOUND });
  });

  it('should return error', async () => {
    UserModel.getUserById.mockResolvedValue({ id: 1 });
    PostModel.createPost.mockRejectedValue(new Error());

    await postController.createPost(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledWith(mockRequest.body.userId);
    expect(PostModel.createPost).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.CREATE_ERROR });
  });

});

describe('Update Post', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.params = { id: 1 };
    mockRequest.body = {
      title: 'title',
      content: 'content',
    };
  });

  it('should update post', async () => {
    const mockPostInDB = { ...mockRequest.params };
    PostModel.updatePost.mockResolvedValue(mockPostInDB);

    await postController.updatePost(mockRequest, mockResponse);

    expect(PostModel.updatePost).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPostInDB);
  });

  it('should return missing update data', async () => {
    mockRequest.body = {};

    await postController.updatePost(mockRequest, mockResponse);

    expect(PostModel.updatePost).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.MISSING_UPDATE_DATA });
  });

  it('should not find post to update by id', async () => {
    PostModel.updatePost.mockResolvedValue(null);

    await postController.updatePost(mockRequest, mockResponse);

    expect(PostModel.updatePost).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.NOT_FOUND });
  });

  it('should return error', async () => {
    PostModel.updatePost.mockRejectedValue(new Error());

    await postController.updatePost(mockRequest, mockResponse);

    expect(PostModel.updatePost).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.UPDATE_ERROR });
  });

});

describe('Delete Post', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.params = { id: 1 };
  });

  it('should delete a post', async () => {
    const mockPostInDB = { ...mockRequest.params };
    PostModel.deletePostById.mockResolvedValue(mockPostInDB);

    await postController.deletePostById(mockRequest, mockResponse);

    expect(PostModel.deletePostById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toBeCalledTimes(1);
  });

  it('should not find a post to delete by id', async () => {
    PostModel.deletePostById.mockResolvedValue(null);

    await postController.deletePostById(mockRequest, mockResponse);

    expect(PostModel.deletePostById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.NOT_FOUND });
  });

  it('should return error', async () => {
    PostModel.deletePostById.mockRejectedValue(new Error());

    await postController.deletePostById(mockRequest, mockResponse);

    expect(PostModel.deletePostById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.DELETE_ERROR });
  });

});

describe('Search Post', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the post by search term", async () => {
    mockRequest.query = { term: 'title' };
    const mockPostInDB = { id: 1 };
    PostModel.searchPosts.mockResolvedValue(mockPostInDB);

    await postController.searchPosts(mockRequest, mockResponse);

    expect(PostModel.searchPosts).toHaveBeenCalledWith([mockRequest.query.term]);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPostInDB);
  });

  it("should return invalid request", async () => {
    mockRequest.query = {};

    await postController.searchPosts(mockRequest, mockResponse);

    expect(PostModel.searchPosts).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.MISSING_KEYWORD });
  });

  it("should return error", async () => {
    mockRequest.query = { term: 'title' };
    PostModel.searchPosts.mockRejectedValue(new Error());

    await postController.searchPosts(mockRequest, mockResponse);

    expect(PostModel.searchPosts).toHaveBeenCalledWith([mockRequest.query.term]);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: postErrors.KEYWORD_SEARCH_ERROR });
  });

});
