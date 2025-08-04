import { PostRepository } from '@/repositories/typeorm/post.repository'
import { CreratePostUseCase } from '../create-post'

export function makeCreatePostUseCase() {
  const postRepository = new PostRepository()
  const createPostUseCase = new CreratePostUseCase(postRepository)

  return createPostUseCase
}