import { Request, Response } from 'express'
import { validatePassword } from '../service/user.service'
import { createSession, findSessions, updateSession } from '../service/session'
import { signJwt } from '../utils/jwt.utils'
import config from 'config'

export async function createUserSessionHandler(req: Request, res: Response) {
  //validate user password
  const user = await validatePassword(req.body)
  if (!user) {
    return res.status(401).send({ message: 'Invalid password or email' })
  }

  //create user session
  const session = await createSession(user._id, req.get('user-agent') || '')

  //create an access token
  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('accessTokenTtl'), //15 minutes
    }
  )

  //create a refresh token
  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('refreshTokenTtl'), //1 year
    }
  )

  //return access and refresh token
  return res.status(200).send({
    accessToken,
    refreshToken,
  })
}

//
export async function getUserSessionsHandler(req: Request, res: Response) {
  //   const userId = res.locals.user._id
  const userId = res.locals.user ? res.locals.user._id : null

  //console.log(userId)
  const sessions = await findSessions({ user: userId, valid: true })

  return res.send(sessions)
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session

  await updateSession({ _id: sessionId }, { valid: false })

  return res.send({
    accessToken: null,
    refreshToken: null,
  })
}
