import { Document, FilterQuery, Schema } from 'mongoose'
import { UserDocument, UserModel } from '../models/user'
import { omit } from 'lodash'

//instead of DocumentDefinition from mongoose, we create our own DocumentDefinition
type DocumentDefinition<T> = Omit<T, keyof Document> & { _id?: string }

export async function createUser(
  input: DocumentDefinition<
    Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>
  >
) {
  try {
    return await UserModel.create(input)
  } catch (e: any) {
    throw new Error(e)
  }
}

//validate password
export async function validatePassword({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const user = await UserModel.findOne({ email })

  if (!user) {
    return false
  }
  const isValid = await user.comparePassword(password)
  if (!isValid) return false
  return omit(user.toJSON(), 'password')
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean()
}
