import Fastify from 'fastify'
import cors from '@fastify/cors'
import {PrismaClient} from '@prisma/client'

const fastify = Fastify()
const prisma = new PrismaClient()

fastify.register(cors,{
  origin: 'http://localhost:5173' // only this origin
})

fastify.get('/', async (request, reply) => {
  const habits = await prisma.habit.findMany()
  return { habits }
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3333}).then(() => {
      console.log('server started');
    })
  } catch (err) {
    fastify.log.error({err })
    process.exit(1)
  }
}
start()