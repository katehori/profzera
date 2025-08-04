import { PostRepository } from '@/repositories/typeorm/post.repository'
import { FindAllPRoductUseCase } from '../find-all-posts'

export function makeFindAllPostUseCase() {
  const productRepository = new PostRepository()

  const findAllPostUseCase = new FindAllPRoductUseCase(productRepository)

  return findAllPostUseCase
}