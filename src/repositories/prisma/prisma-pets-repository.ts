import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { FindManyNearbyParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findManyByCity({
    city,
    age,
    size,
    energyLevel,
    independence,
    environment,
  }: FindManyNearbyParams) {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city: {
            contains: city,
            mode: 'insensitive',
          },
        },
        age: age ? age : undefined,
        size: size ? size : undefined,
        energyLevel: energyLevel ? energyLevel : undefined,
        independence: independence ? independence : undefined,
        environment: environment ? environment : undefined,
      },
    })

    return pets
  }
}