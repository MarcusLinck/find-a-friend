import { Pet, Prisma } from '@prisma/client'
import { FindManyNearbyParams, PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energyLevel: data.energyLevel,
      independence: data.independence,
      environment: data.environment,
      photos: (data.photos as string[]) ?? [],
      requirements: (data.requirements as string[]) ?? [],
      orgId: data.orgId,
      createdAt: new Date(),
    }

    this.items.push(pet)

    return pet
  }

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findManyByCity(params: FindManyNearbyParams) {
    // Como no in-memory precisamos filtrar pelo relacionamento com a Org (cidade), 
    // vamos implementar a lógica básica de filtragem por características e cidade.
    // (Nota: No Prisma faremos a query unida com a tabela de Orgs).
    return this.items.filter((item) => {
      if (params.age && item.age !== params.age) return false
      if (params.size && item.size !== params.size) return false
      if (params.energyLevel && item.energyLevel !== params.energyLevel) return false
      if (params.independence && item.independence !== params.independence) return false
      if (params.environment && item.environment !== params.environment) return false

      return true
    })
  }
}