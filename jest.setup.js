const dotenv = require('dotenv');

// Carrega variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

jest.mock('knex', () => {
  return jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([])
  }));
});

jest.setTimeout(10000);

afterEach(() => {
  jest.clearAllMocks();
});

global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};