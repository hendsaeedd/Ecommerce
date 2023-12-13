import jwt from 'jsonwebtoken'
import config from 'config'

const privateKey = config.get<string>('privateKey')
const ptoken = config.get<string>('publicKey')

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  const signingKey = Buffer.from(
    config.get<string>(privateKey),
    'base64'
  ).toString('ascii')

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: 'RS256',
  })
}

export function verifyJwt(token: string) {
  const publicKey = Buffer.from(config.get<string>(ptoken), 'base64').toString(
    'ascii'
  )

  try {
    const decoded = jwt.verify(token, publicKey)
    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (e: any) {
    console.error(e)
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    }
  }
}
