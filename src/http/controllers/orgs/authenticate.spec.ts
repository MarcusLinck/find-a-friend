import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Authenticate ORG (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate an org', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Pet Safe Org',
      email: 'auth@petsafe.com',
      whatsapp: '51999999999',
      password: 'password123',
      cep: '90000000',
      state: 'RS',
      city: 'Canoas',
      neighborhood: 'Centro',
      street: 'Rua Exemplo',
      latitude: -29.9189,
      longitude: -51.1794,
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'auth@petsafe.com',
      password: 'password123',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})