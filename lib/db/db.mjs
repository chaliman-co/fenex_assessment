import { connect } from 'mongoose'
import 'dotenv/config.js'
const url = process.env.DB_URL
export const connection = await connect(url)
console.log('connected to db')
export const connectToDb = connect
