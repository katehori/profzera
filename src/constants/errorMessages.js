const postErrors = {
  MISSING_KEYWORD: 'Termo(s) de busca necessário(s)',
  MISSING_CREATE_DATA: 'Informações necessárias (título/conteúdo/usuário)',
  MISSING_UPDATE_DATA: 'Informações necessárias (título/conteúdo)',
  KEYWORD_SEARCH_ERROR: 'Erro ao buscar as publicações que contenham o termo pesquisado',
  FIND_ALL_ERROR: 'Erro ao buscar todas as publicações',
  CREATE_ERROR: 'Erro ao criar publicação',
  NOT_FOUND: 'Publicação não encontrada',
  FIND_BY_ID_ERROR: 'Erro ao buscar publicação pelo ID',
  UPDATE_ERROR: 'Erro ao atualizar publicação',
  DELETE_ERROR: 'Erro ao excluir publicação'
}

const userErrors = {
  MISSING_CREDENTIALS: 'Credenciais necessárias (usuário/senha)',
  MISSING_CREATE_DATA: 'Informações necessárias (usuário/senha/tipo)',
  MISSING_UPDATE_DATA: 'Informações necessárias (senha)',
  DUPLICATE_USERNAME: 'Nome de usuário já existente',
  LOGIN_ERROR: 'Erro ao realizar login',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  INVALID_TYPE: 'Tipo de usuário inválido',
  FIND_ALL_ERROR: 'Erro ao buscar todos os usuários',
  CREATE_ERROR: 'Erro ao criar usuário',
  NOT_FOUND: 'Usuário não encontrado',
  FIND_BY_ID_ERROR: 'Erro ao buscar usuário pelo ID',
  UPDATE_ERROR: 'Erro ao atualizar usuário',
  DELETE_ERROR: 'Erro ao excluir usuário'
}

module.exports = { postErrors, userErrors };