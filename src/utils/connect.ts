import mongoose from 'mongoose'
import config from 'config'

export async function connect() {
  const dbUri = config.get<string>('dbUri')

  return mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB'))
}