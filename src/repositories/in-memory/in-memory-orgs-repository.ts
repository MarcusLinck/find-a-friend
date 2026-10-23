import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgUncheckedCreateInput) {
    const org: Org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      passwordHash: data.passwordHash,
      cep: data.cep,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      latitude: new Prisma.Decimal(Number(data.latitude)),
      longitude: new Prisma.Decimal(Number(data.longitude)),
      createdAt: new Date(),
    }

    this.items.push(org)

    return org
  }
}