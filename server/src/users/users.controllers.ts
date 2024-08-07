// src/modules/students/controllers/student.controller.ts
import { Users } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '../constants/statusCodeServer.const'
import { ResponseHandler } from '../libs/response.lib'
import { ICustomRequest } from '../types'
import * as getAllUsersServices from './users.services'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'

export const getAllUsersControllers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersServices.getAllUsersServices()
    res.json(users)
  } catch (err: any) {
    res.status(500).send('Server Error')
  }
}

export const createUsersControllers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, type_user: typeUser } = req.body

    // Crear el objeto de datos del usuario con las propiedades requeridas
    const userData: Omit<Users, 'user_id' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
      name,
      email,
      password,
      type_user: typeUser,
      state: 'ACTIVE'
    }

    const user = await getAllUsersServices.createUsersServices(userData)
    new ResponseHandler(res).sendResponse(HTTP_STATUS.CREATED, 'User created successfully', user)
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Prisma error:', { ...error, message: error.message })
      return new ResponseHandler(res).sendError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'server error')
    }
    if (error instanceof PrismaClientValidationError) {
      console.error('Prisma validation error:', { ...error, message: error.message })
      return new ResponseHandler(res).sendError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'server error')
    }
    next(error)
  }
}

export const getUsersByIdControllers = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getAllUsersServices.getUserByIdServices(String(req.params.id))
    if (user != null) {
      res.status(200).json(user)
    } else {
      res.status(404).send('Student not found')
    }
  } catch (err) {
    res.status(500).send('Server Error')
  }
}

export const updateUsersControllers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersServices.updateUsersServices(String(req.params.id), req.body)
    res.status(200).json(users)
  } catch (err) {
    res.status(500).send('Server Error')
  }
}

export const deleteUsersControllers = async (req: Request, res: Response): Promise<void> => {
  try {
    await getAllUsersServices.deleteUsersServices(String(req.params.id))
    res.status(204).send('User deleted successfully')
  } catch (err) {
    res.status(500).send('Server Error')
  }
}

export const getProfileControllers = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = req.user
    if (payload === undefined) {
      throw new Error('User not found')
    }

    if (typeof payload === 'string') {
      throw new Error('User not found')
    }
    const { userId, role } = payload

    const user = await getAllUsersServices.getUserProfileByTypeUser(userId, role)

    new ResponseHandler(res).sendResponse(HTTP_STATUS.OK, 'User profile', user)
  } catch (error) {
    next(error)
  }
}
