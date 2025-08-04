import { IPost } from '@/entities/models/post.interface'
import { IPostRepository } from '@/repositories/post.repository.interface'

export class CreratePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async handler(post: IPost): Promise<IPost> {
    return this.postRepository.create(post)
  }
}