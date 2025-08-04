import { makeCreatePostUseCase } from '@/use-cases/factory/make-create-post-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    author: z.string(),
  })

  const { title, content, author } =
    registerBodySchema.parse(request.body)

  const createPostUseCase = makeCreatePostUseCase()

  const post = await createPostUseCase.handler({
    title,
    content,
    author,
  })

  return reply.status(201).send(post)
}