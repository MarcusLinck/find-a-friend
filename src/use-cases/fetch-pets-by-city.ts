import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface FetchPetsByCityUseCaseRequest {
  city: string
  age?: string
  size?: string
  energyLevel?: string
  independence?: string
  environment?: string
}

interface FetchPetsByCityUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    age,
    size,
    energyLevel,
    independence,
    environment,
  }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
    const pets = await this.petsRepository.findManyByCity({
      city,
      age,
      size,
      energyLevel,
      independence,
      environment,
    })

    return {
      pets,
    }
  }
}