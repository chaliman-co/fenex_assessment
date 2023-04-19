import { Router, json as jsonBodyParser } from 'express'
import postHandler from './post.mjs'
const router = new Router()
router.post('/', jsonBodyParser(), postHandler)

export default router
