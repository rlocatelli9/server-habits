import dayjs from 'dayjs';
import {FastifyInstance} from 'fastify'
import { prisma } from "../lib/prisma"
import {z} from 'zod'

export async function appRoutes(app: FastifyInstance){
  app.get('/', async (request, reply) => {
    const habits = await prisma.habit.findMany()
    return { habits }
  })

  app.post('/habits', async (request, response) => {
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

  app.get('/day', async (request, response) => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    // todos habitos possiveis no dia
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        habitWeekdays: {
          some: {
            week_day: weekDay
          }
        }
      }
    })

    // todos habitos completados
    const day =  await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate()
      },
      include: {
        dayHabits: true,
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })


    return {
      possibleHabits,
      completedHabits
    }
    


  })
}