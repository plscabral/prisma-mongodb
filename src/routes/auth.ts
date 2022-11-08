import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth', async (request, reply) => {
    const authenticationBody = z.object({
      email: z.string().email(),
      password: z.string()
    })

    const { email, password } = authenticationBody.parse(request.body)

    const user = await prisma.user.findFirst({
      where: {
        email,
        password
      }
    })

    if (!user) {
      return reply.status(401).send({
        message: 'E-mail ou senha inválidos!'
      })
    }

    const token = fastify.jwt.sign({}, {
      //sub: user.id,
      expiresIn: '7 days'
    })

    return { token }
  })
}