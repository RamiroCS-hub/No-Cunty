/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Parents, Prisma, PrismaClient, Users } from '@prisma/client'
import { IParentFilter, IParentRepository } from './interface/parent.interface'
import { CreateParentSchema } from '../schemas/parent.schema'

export class ParentRepository implements IParentRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async findParentByUserId (userId: string): Promise<Parents | null> {
    const parent = await this.prisma.parents.findFirst({
      where: {
        user_id: userId
      }
    })
    return parent
  }

  async getAllParents (page: number, limit: number, filtro: IParentFilter): Promise<IParentWithUser[]> {
    const userWhereConditions: Prisma.UsersWhereInput = {
      AND: [
        filtro.name ? { name: { contains: filtro.name, mode: 'insensitive' } } : {},
        filtro.email ? { email: { contains: filtro.email, mode: 'insensitive' } } : {}
      ]
    }

    const parents = await this.prisma.parents.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        user: {
          ...userWhereConditions
        }
      },
      include: {
        user: true // Para incluir los datos del usuario en la respuesta, si es necesario
      }
    })

    return parents
  }

  async createParent (data: CreateParentSchema): Promise<Parents> {
    const parent = await this.prisma.parents.create({
      data: {
        user_id: data.userId,
        relation: data.relation
      }
    })
    return parent
  }

  async countFilteredParents (filtros: IParentFilter): Promise<number> {
    const userWhereConditions: Prisma.UsersWhereInput = {
      AND: [
        filtros.name ? { name: { contains: filtros.name, mode: 'insensitive' } } : {},
        filtros.email ? { email: { contains: filtros.email, mode: 'insensitive' } } : {}
      ]
    }
    const count = await this.prisma.parents.count({
      where: {
        user: {
          ...userWhereConditions
        }
      }
    })

    return count
  }
}

export interface IParentWithUser extends Parents {
  user: Users
}