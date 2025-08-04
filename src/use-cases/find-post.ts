import { IPostRepository } from '@/repositories/post.repository.interface'
import { PostNotFoundError } from './errors/post-not-found-error'

export class FindPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async handler(id: string) {
    const post = await this.postRepository.findById(id)

    if (!post) throw new PostNotFoundError()

    return post
  }
}