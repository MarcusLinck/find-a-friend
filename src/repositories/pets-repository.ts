import { Pet, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  city: string
  age?: string
  size?: string
  energyLevel?: string
  independence?: string
  environment?: string
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet | null>
  findById(id: string): Promise<Pet | null>
  findManyByCity(params: FindManyNearbyParams): Promise<Pet[]>
}