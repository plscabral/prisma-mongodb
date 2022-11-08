import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugin/authenticate";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/user', { onRequest: [authenticate] }, async (request, reply) => {
    const createUserBody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string()
    })

    const { name, email, password } = createUserBody.parse(request.body);

    await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })

    return reply.status(201).send()
  })

  fastify.get('/users', { onRequest: [authenticate] }, async () => {
    const users = await prisma.user.findMany()

    return { users }
  })
}