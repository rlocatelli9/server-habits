import dayjs from 'dayjs';
import {FastifyInstance} from 'fastify'
import { prisma } from "../lib/prisma"
import {z} from 'zod'

export async function appRoutes(app: FastifyInstance){
  app.get('/', async (request, reply) => {
    const habits = await prisma.habit.findMany()
    return { habits }
  })

  app.post('/habits', async (request, reply) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekdays: z.array(
        z.number().min(0).max(6)
      )
    })
    const {title, weekdays} = createHabitBody.parse(request.body)
    
    const today = dayjs().startOf('day').toDate()

    console.log({title, weekdays})

    await prisma.habit.create({
      data:{
        title,
        created_at: today,
        habitWeekdays: {
          create: weekdays.map(day => {
            return {
              week_day: day
            }
          })
        }
      }
    })
    
  })
}