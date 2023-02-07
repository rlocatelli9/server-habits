import dayjs from 'dayjs';
import {FastifyInstance} from 'fastify'
import { prisma } from "../lib/prisma"
import {z, ZodError} from 'zod'

export async function usersRoutes(app: FastifyInstance){

  app.post('/users/signup', async (request, reply) => {
    const createUserBody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    try {
      const {email, name, password} = createUserBody.parse(request.body)
      console.log({email, name, password})
    
      const today = dayjs().toDate()

      const possibleUser = await prisma.user.findUnique({
        where: {
          email,
        }
      })

      if(possibleUser){
        throw new Error("O e-mail informado já está em uso.") 
      }
      
      await prisma.user.create({
        data:{
          name, 
          email, 
          password,
          created_at: today,
        }
      })  

      return reply.status(200).send({message: 'Cadastro realizado com sucesso.'})
    } catch (error: any) {
      if(error instanceof ZodError) {
        let issueError = {
          validationError: true,
          message: 'Error de validação',
          fields:[] as Array<string|number>
        }
        error.issues && error.issues.forEach(issue => {
          issue.path.forEach(item => {
            issueError.fields.push(item)
          })
        });
        return reply.status(400).send(issueError)
      }
      return reply.status(500).send({message: error.message})
    }

  })

  app.post('/users/signin', async (request, reply) => {
    const createUserBody = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    try {
      const {email, password} = createUserBody.parse(request.body)

      const possibleUser = await prisma.user.findUnique({
        where: {
          email,
        }
      })

      if(!possibleUser){
        throw new Error("Usuário não encontrado")
      }

      if(possibleUser.password !== password){
        throw new Error("Dados inválidos")
      }

      return {
        name: possibleUser.name,
        email: possibleUser.email,
      }

  } catch (error: any) {
    if(error instanceof ZodError) {
      let issueError = {
        validationError: true,
        message: 'Error de validação',
        fields:[] as Array<string|number>
      }
      error.issues && error.issues.forEach(issue => {
        issue.path.forEach(item => {
          issueError.fields.push(item)
        })
      });
      return reply.status(400).send(issueError)
    }
    return reply.status(401).send({message: 'Não foi possível realizar o login.'})
  }


    return {
      possibleHabits,
      completedHabits
    }  

  })
}