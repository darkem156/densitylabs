import { Sequelize } from 'sequelize'
import {createConnection} from 'mysql2/promise'
import comment from './comment'

const host = process.env.DB_HOST || 'localhost'
const database = process.env.DB_NAME || 'bd'
const username = process.env.DB_USER || 'root'
const password = process.env.DB_PASS || 'password'

createConnection({
  host,
  user: username,
  password 
}).then(connection => {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`)
  connection.destroy()
  console.log('Database ready')
})//.catch(console.error)

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: 'mysql'
})

export const Comment = sequelize.define('comment', comment)

;(async () => {
  try {
    await sequelize.sync()
  } catch (error) {
    console.error(error)
  }
})()
