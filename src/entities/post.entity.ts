import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IPost } from './models/post.interface'

@Entity({
  name: 'post',
})
export class Post implements IPost {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string | undefined

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string

  @Column({
    name: 'author',
    type: 'text',
  })
  author: string

  @Column({
    name: 'creation_date',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date
}