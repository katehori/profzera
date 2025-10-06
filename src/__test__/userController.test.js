const userController = require("../controllers/userController");
const UserModel = require("../models/user");
const { userErrors } = require("../constants/errorMessages");

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

describe('Get All Users', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of users', async () => {
    const mockUsersInDB = [];
    UserModel.getAllUsers.mockResolvedValue(mockUsersInDB);

    await userController.getAllUsers(mockRequest, mockResponse);

    expect(UserModel.getAllUsers).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUsersInDB);
  });

  it('should return error', async () => {
    UserModel.getAllUsers.mockRejectedValue(new Error());

    await userController.getAllUsers(mockRequest, mockResponse);

    expect(UserModel.getAllUsers).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.FIND_ALL_ERROR });
  });

});

describe('Get User by ID', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.params = { id: 1 };
  });

  it('should return the user by ID', async () => {
    const mockUserInDB = mockRequest.params;
    UserModel.getUserById.mockResolvedValue(mockUserInDB);

    await userController.getUserById(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUserInDB);
  });

  it('should return not found by ID', async () => {
    UserModel.getUserById.mockResolvedValue(null);

    await userController.getUserById(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.NOT_FOUND });
  });

  it('should return error', async () => {
    UserModel.getUserById.mockRejectedValue(new Error());

    await userController.getUserById(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.FIND_BY_ID_ERROR });
  });

});

describe('Create User', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = {
      username: 'username',
      password: 'password',
      type: 0,
    };
  });

  it('should create a new user', async () => {
    const mockUserInDB = { id: 1 };
    UserModel.createUser.mockResolvedValue(mockUserInDB);

    await userController.createUser(mockRequest, mockResponse);

    expect(UserModel.createUser).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUserInDB);
  });

  it('should return missing create data', async () => {
    mockRequest.body = {};

    await userController.createUser(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.MISSING_CREATE_DATA });
  });

  it('should return user invalid type', async () => {
    mockRequest.body = { ...mockRequest.body, type: 4 };

    await userController.createUser(mockRequest, mockResponse);

    expect(UserModel.getUserById).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.INVALID_TYPE });
  });

  it('should return duplicate user error', async () => {
    const error = new Error();
    error.code = '23505';
    error.constraint = 'users_username_key';
    UserModel.createUser.mockRejectedValue(error);

    await userController.createUser(mockRequest, mockResponse);

    expect(UserModel.createUser).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.DUPLICATE_USERNAME });
  });

  it('should return error', async () => {
    UserModel.createUser.mockRejectedValue(new Error());

    await userController.createUser(mockRequest, mockResponse);

    expect(UserModel.createUser).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.CREATE_ERROR });
  });

});

describe('Update User', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.params = { id: 1 };
    mockRequest.body = {
      password: 'password',
    };
  });

  it('should update user', async () => {
    const mockUserInDB = { ...mockRequest.params };
    UserModel.updateUser.mockResolvedValue(mockUserInDB);

    await userController.updateUser(mockRequest, mockResponse);

    expect(UserModel.updateUser).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUserInDB);
  });

  it('should return missing update data', async () => {
    mockRequest.body = {};

    await userController.updateUser(mockRequest, mockResponse);

    expect(UserModel.updateUser).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.MISSING_UPDATE_DATA });
  });

  it('should not find user to update by id', async () => {
    UserModel.updateUser.mockResolvedValue(null);

    await userController.updateUser(mockRequest, mockResponse);

    expect(UserModel.updateUser).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.NOT_FOUND });
  });

  it('should return error', async () => {
    UserModel.updateUser.mockRejectedValue(new Error());

    await userController.updateUser(mockRequest, mockResponse);

    expect(UserModel.updateUser).toHaveBeenCalledWith(mockRequest.params.id, mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.UPDATE_ERROR });
  });

});

describe('Delete User', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.params = { id: 1 };
  });

  it('should delete a user', async () => {
    const mockUserInDB = { ...mockRequest.params };
    UserModel.deleteUserById.mockResolvedValue(mockUserInDB);

    await userController.deleteUserById(mockRequest, mockResponse);

    expect(UserModel.deleteUserById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toBeCalledTimes(1);
  });

  it('should not find a user to delete by id', async () => {
    UserModel.deleteUserById.mockResolvedValue(null);

    await userController.deleteUserById(mockRequest, mockResponse);

    expect(UserModel.deleteUserById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.NOT_FOUND });
  });

  it('should return error', async () => {
    UserModel.deleteUserById.mockRejectedValue(new Error());

    await userController.deleteUserById(mockRequest, mockResponse);

    expect(UserModel.deleteUserById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.DELETE_ERROR });
  });

});

describe('Login User', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = {
      username: 'username',
      password: 'password',
    };
  });

  it("should return user", async () => {
    const mockUserInDB = { id: 1 };
    UserModel.login.mockResolvedValue(mockUserInDB);

    await userController.login(mockRequest, mockResponse);

    expect(UserModel.login).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUserInDB);
  });

  it("should return missing credentials", async () => {
    mockRequest.body = {};

    await userController.login(mockRequest, mockResponse);

    expect(UserModel.login).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.MISSING_CREDENTIALS });
  });

  it("should return invalid credentials", async () => {
    UserModel.login.mockResolvedValue(null);

    await userController.login(mockRequest, mockResponse);

    expect(UserModel.login).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.INVALID_CREDENTIALS });
  });

  it("should return error", async () => {
    UserModel.login.mockRejectedValue(new Error());

    await userController.login(mockRequest, mockResponse);

    expect(UserModel.login).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: userErrors.LOGIN_ERROR });
  });

});
