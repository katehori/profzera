export class InvalidCredentialsError extends Error {
  constructor() {
    super('Nome de usuário ou senha estão incorretos')
  }
}