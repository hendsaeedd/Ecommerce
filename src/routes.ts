import { Express, Request, Response } from 'express'
import { createUserHandler } from './controller/user'
import { createUserSchema } from './schema/user'
import validateResource from './middleware/validateResource'
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from './controller/session'
import { createSessionSchema } from './schema/session'
import { requireUser } from './middleware/requireUser'
import {
  createProductHandler,
  updateProductHandler,
  getProductHandler,
  deleteProductHandler,
} from './controller/product'
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
} from './schema/product'

export function routes(app: Express) {
  //get
  app.get('/api', (req: Request, res: Response) => {
    res.status(200).send('Hello World!')
  })

  //create user
  app.post('/api/users', validateResource(createUserSchema), createUserHandler)

  //sessions
  //create sesson
  app.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler
  )

  //get session
  app.get('/api/sessions', getUserSessionsHandler)

  //delete session
  app.delete('/api/sessions', deleteSessionHandler)

  //products
  //create products
  app.post(
    '/api/products',
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  )

  //update products
  app.put(
    '/api/products/:productId',
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  )

  //get products
  app.get(
    '/api/products/:productId',
    validateResource(getProductSchema),
    getProductHandler
  )

  //delete products
  app.delete(
    '/api/products/:productId',
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  )
}
