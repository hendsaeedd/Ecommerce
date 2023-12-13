import { Request, Response } from 'express' 
import { createUser } from '../service/user.service'
import { CreateUserInput } from '../schema/user'
import {omit} from 'lodash'

export async function createUserHandler(req: Request<{},{},CreateUserInput['body']>, res: Response) {
    try {
        const user = await createUser(req.body)
        //return user data without password
        return res.send(omit(user.toJSON(), 'password'))
    } catch (e:any) {
        res.status(409).send(e.message)
    }
}
