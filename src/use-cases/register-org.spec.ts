import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgUseCase } from './register-org'
import { compare } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register an org', async () => {
    const { org } = await sut.execute({
      name: 'Pet Safe Org',
      email: 'contato@petsafe.com',
      whatsapp: '51999999999',
      password: '123456',
      cep: '90000000',
      state: 'RS',
      city: 'Canoas',
      neighborhood: 'Centro',
      street: 'Rua Exemplo',
      latitude: -29.9189,
      longitude: -51.1794,
    })

    expect(org.id).toEqual(expect.any(String))
    
    const isPasswordSuccessfullyHashed = await compare('123456', org.passwordHash)
    expect(isPasswordSuccessfullyHashed).toBe(true)
  })

  it('should not be able to register with existing email', async () => {
    const email = 'contato@petsafe.com'

    await sut.execute({
      name: 'Pet Safe Org',
      email,
      whatsapp: '51999999999',
      password: '123456',
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
        name: 'Another Org',
        email,
        whatsapp: '51888888888',
        password: '123456',
        cep: '90000000',
        state: 'RS',
        city: 'Canoas',
        neighborhood: 'Centro',
        street: 'Rua Exemplo',
        latitude: -29.9189,
        longitude: -51.1794,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})