import { PrismaClient } from '@prisma/client'
import { ParentRepository } from '../repositories/parent.repository'
import { ParentService } from '../services/parent.service'
import { ResponseHandler } from '../../libs/response.lib'
import { ICustomRequest } from '../../types'
import { Response, NextFunction } from 'express'
import { queryParamsSchema } from '../schemas/parent.schema'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { z } from 'zod'
import { formattedErrorsZod } from '../../libs/formatedErrorsZod'
const parentService = new ParentService(new ParentRepository(new PrismaClient()))
export class ParentCtrl {
  async getAllParents (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = queryParamsSchema.parse(req.query).page
      const limit = queryParamsSchema.parse(req.query).limit
      const name = queryParamsSchema.parse(req.query).name
      const email = queryParamsSchema.parse(req.query).email
      const filters = { name, email }
      const parent = await parentService.getAllParents(page, limit, filters)
      new ResponseHandler(res).sendResponse(200, 'Get all parents successfully', parent)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return new ResponseHandler(res).sendError(500, 'server error')
      }
      if (error instanceof z.ZodError) {
        const errors = formattedErrorsZod(error)
        return new ResponseHandler(res).sendError(400, 'Validation error', errors)
      }
      next(error)
    }
  }
}