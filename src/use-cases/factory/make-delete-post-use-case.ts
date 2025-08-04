import { PostRepository } from '@/repositories/typeorm/post.repository'
import { DeletePostUseCase } from '../delete-post'

export function makeDeletePostUseCase() {
  const postRepository = new PostRepository()

  const deletePostUseCase = new DeletePostUseCase(postRepository)

  return deletePostUseCase
}