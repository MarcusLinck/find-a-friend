import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerPetBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.string(),
    size: z.string(),
    energyLevel: z.string(),
    independence: z.string(),
    environment: z.string(),
    photos: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
  })

  const data = registerPetBodySchema.parse(request.body)
  const orgId = request.user.sub

  try {
    const registerPetUseCase = makeRegisterPetUseCase()

    const { pet } = await registerPetUseCase.execute({
      ...data,
      orgId,
    })

    return reply.status(201).send({ pet })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}