import passport from 'passport'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import cors from 'cors'
import 'dotenv/config.js'
import apiRouter from './routes/api/api.mjs'
const app = express()

if (process.env.ENV !== 'production') app.use(logger('dev'))
app.use(cors())
app.use(express.static(path.resolve('public')))
app.use('/api', apiRouter)
app.get('*', function (req, res, next) {
  return res.sendFile(path.resolve('public/index.html'))
})
export default app
