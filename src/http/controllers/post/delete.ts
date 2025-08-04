import { makeDeletePostUseCase } from '@/use-cases/factory/make-delete-post-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deletePost(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerParamsSchema = z.object({
    id: z.coerce.string(),
  })

  const { id } = registerParamsSchema.parse(request.params)

  const deletePostUseCase = makeDeletePostUseCase()

  await deletePostUseCase.handler(id)

  return reply.status(204).send()
}