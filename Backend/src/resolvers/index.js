// import model
import db from '../models/mock'

export const getUsers = async () => db

export const hello = async () => ({ hello: 'world' })

export const getUser = async id => db.find(data => data.id === id)
