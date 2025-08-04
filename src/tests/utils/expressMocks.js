// Cria um mock de request do Express
const mockRequest = (body = {}, params = {}, query = {}, user = {}) => ({
  body,
  params,
  query,
  user,
  headers: {
    'content-type': 'application/json',
    authorization: 'Bearer fake-token'
  }
});

// Cria um mock de response do Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn();
  return res;
};

// Mock de função next do Express
const mockNext = jest.fn();

module.exports = {
  mockRequest,
  mockResponse,
  mockNext
};