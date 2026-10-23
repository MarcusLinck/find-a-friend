import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchPetsByCityUseCase } from '@/use-cases/factories/make-fetch-pets-by-city-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsParamsSchema = z.object({
    city: z.string(),
  })

  const searchPetsQuerySchema = z.object({
    age: z.string().optional(),
    size: z.string().optional(),
    energyLevel: z.string().optional(),
    independence: z.string().optional(),
    environment: z.string().optional(),
  })

  const { city } = searchPetsParamsSchema.parse(request.params)
  const { age, size, energyLevel, independence, environment } =
    searchPetsQuerySchema.parse(request.query)

  const fetchPetsByCityUseCase = makeFetchPetsByCityUseCase()

  const { pets } = await fetchPetsByCityUseCase.execute({
    city,
    age,
    size,
    energyLevel,
    independence,
    environment,
  })

  return reply.status(200).send({ pets })
}