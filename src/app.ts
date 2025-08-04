import 'reflect-metadata'
import '@/lib/typeorm/typeorm'
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { globalErrorHandler } from './utils/global-error-handler'
import { postRoutes } from './http/controllers/post/routes'
import { env } from './env'
import { validateJwt } from './http/middlewares/jwt-validate'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: '10m' },
})

app.addHook('onRequest', validateJwt)

app.register(postRoutes)

app.setErrorHandler(globalErrorHandler)