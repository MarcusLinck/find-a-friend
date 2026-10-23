import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be able to authenticate', async () => {
    const passwordHash = await hash('123456', 6)

    await orgsRepository.create({
      name: 'Pet Safe Org',
      email: 'contato@petsafe.com',
      whatsapp: '51999999999',
      passwordHash,
      cep: '90000000',
      state: 'RS',
      city: 'Canoas',
      neighborhood: 'Centro',
      street: 'Rua Exemplo',
      latitude: -29.9189,
      longitude: -51.1794,
    })

    const { org } = await sut.execute({
      email: 'contato@petsafe.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong-email@petsafe.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const passwordHash = await hash('123456', 6)

    await orgsRepository.create({
      name: 'Pet Safe Org',
      email: 'contato@petsafe.com',
      whatsapp: '51999999999',
      passwordHash,
      cep: '90000000',
      state: 'RS',
      city: 'Canoas',
      neighborhood: 'Centro',
      street: 'Rua Exemplo',
      latitude: -29.9189,
      longitude: -51.1794,
    })

    await expect(() =>
      sut.execute({
        email: 'contato@petsafe.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})