import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'

const fastify = Fastify()

fastify.register(cors,{
  origin: 'http://localhost:5173' // only this origin
})

fastify.register(appRoutes)

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