import { Router } from 'express'
import { _404ErrorHandler, dbErrorHandler, internalServerErrorHandler } from '../../lib/utils.mjs'
import usersRouter from './users/users.mjs'
import productsRouter from './products/products.mjs'
import categoriesRouter from './categories/categories.mjs'
import authRouter from './auth/auth.mjs'
const router = new Router()

router
  .get('/', (req, res, next) => {
    return res._success()
  })
  .use('/users', usersRouter)
  .use('/auth', authRouter)
  .use('/products', productsRouter)
  .use('/categories', categoriesRouter)
  .use(_404ErrorHandler) // handle 404
  .use(dbErrorHandler) // handle all  database related errors
  .use(internalServerErrorHandler) // handle internal server errors
export default router
