import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Create and Search Pets (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet and search for it by city', async () => {
    // 1. Cadastra a ORG
    await request(app.server).post('/orgs').send({
      name: 'Pet Shelter',
      email: 'shelter@petsafe.com',
      whatsapp: '51999999999',
      password: 'password123',
      cep: '90000000',
      state: 'RS',
      city: 'Porto Alegre',
      neighborhood: 'Centro',
      street: 'Rua Teste',
      latitude: -30.0346,
      longitude: -51.2177,
    })

    // 2. Faz login para obter o token JWT
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'shelter@petsafe.com',
      password: 'password123',
    })

    const { token } = authResponse.body

    // 3. Cadastra um pet autenticado
    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rex',
        about: 'Um cachorro muito amigável',
        age: 'adulto',
        size: 'grande',
        energyLevel: 'alta',
        independence: 'baixo',
        environment: 'amplo',
      })

    // 4. Busca o pet publicamente por cidade
    const response = await request(app.server).get(
      '/pets/city/Porto Alegre?size=grande',
    )

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0].name).toEqual('Rex')
  })
})