import { IPost } from '@/entities/models/post.interface'

export interface IPostRepository {
  findAll(page: number, limit: number): Promise<IPost[]>
  findById(id: string): Promise<IPost | null>
  create(post: IPost): Promise<IPost>
  update(post: IPost): Promise<IPost>
  delete(id: string): Promise<void>
}