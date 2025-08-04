import { DataSource } from 'typeorm'

import { env } from '@/env'

import { Post } from '@/entities/post.entity'
import { PostAutoGenerateUUID1714090143497 } from './migrations/1714090143497-PostAutoGenerateUUID'

export const appDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [Post],
  migrations: [PostAutoGenerateUUID1714090143497],
  logging: env.NODE_ENV === 'development',
})

appDataSource
  .initialize()
  .then(() => {
    console.log('Banco de dados com typeorm conectado')
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados com typeorm', error)
  })