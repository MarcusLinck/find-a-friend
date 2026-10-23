import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { register } from './register'
import { getDetails } from './get-details'
import { search } from './search'

export async function petsRoutes(app: FastifyInstance) {
  // Rotas públicas
  app.get('/pets/city/:city', search)
  app.get('/pets/:petId', getDetails)

  // Rotas autenticadas (Apenas ORGs autenticadas)
  app.post('/pets', { onRequest: [verifyJwt] }, register)
}