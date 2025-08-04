import { FastifyInstance } from 'fastify'
import { create } from './create'
import { findAllPosts } from './find-all-posts'
import { findPost } from './find-post'
import { update } from './update'
import { deletePost } from './delete'

export async function postRoutes(app: FastifyInstance) {
  app.get('/post', findAllPosts)
  app.get('/post/:id', findPost)
  app.post('/post', create)
  app.put('/post/:id', update)
  app.delete('/post/:id', deletePost)
}