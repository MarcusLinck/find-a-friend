import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { FetchPetsByCityUseCase } from './fetch-pets-by-city'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: FetchPetsByCityUseCase

describe('Fetch Pets By City Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchPetsByCityUseCase(petsRepository)
  })

  it('should be able to fetch pets by city', async () => {
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

    await petsRepository.create({
      name: 'Bobi',
      about: 'Cãozinho legal',
      age: 'filhote',
      size: 'medio',
      energyLevel: 'alta',
      independence: 'medio',
      environment: 'medio',
      orgId: org.id,
    })

    await petsRepository.create({
      name: 'Thor',
      about: 'Gato calmo',
      age: 'adulto',
      size: 'pequeno',
      energyLevel: 'baixa',
      independence: 'alto',
      environment: 'pequeno',
      orgId: org.id,
    })

    const { pets } = await sut.execute({
      city: 'Canoas',
      age: 'filhote',
    })

    expect(pets).toHaveLength(1)
    expect(pets[0]!.name).toEqual('Bobi')
  })
})