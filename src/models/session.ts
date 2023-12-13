import mongoose from 'mongoose'
import { UserDocument } from '../models/user'

export interface UserInput {
  user: UserDocument['_id']
  valid: boolean
  userAgent: string
}

export interface SessionDocument extends UserInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
)

export const SessionModel = mongoose.model<SessionDocument>(
  'Session',
  sessionSchema
)
