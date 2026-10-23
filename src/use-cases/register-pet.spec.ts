import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterPetUseCase } from './register-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: RegisterPetUseCase

describe('Register Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterPetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to register a new pet', async () => {
    const org = await orgsRepository.create({
      name: 'Pet Safe Org',
      email: 'contato@petsafe.com',
      whatsapp: '51999999999',
      passwordHash: '123456',
      cep: '90000000',
      state: 'RS',
      city: 'Canoas',
      neighborhood: 'Centro',
      street: 'Rua Exemplo',
      latitude: -29.9189,
      longitude: -51.1794,
    })

    const { pet } = await sut.execute({
      name: 'Bobi',
      about: 'Cãozinho muito carinhoso e brincalhão',
      age: 'filhote',
      size: 'medio',
      energyLevel: 'alta',
      independence: 'medio',
      environment: 'medio',
      orgId: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toEqual('Bobi')
  })

  it('should not be able to register a pet with non-existing org', async () => {
    await expect(() =>
      sut.execute({
        name: 'Bobi',
        about: 'Cãozinho muito carinhoso e brincalhão',
        age: 'filhote',
        size: 'medio',
        energyLevel: 'alta',
        independence: 'medio',
        environment: 'medio',
        orgId: 'non-existing-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})