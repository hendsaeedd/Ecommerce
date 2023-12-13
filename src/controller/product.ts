import { Request, Response } from 'express'
import { CreateProductInput, UpdateProductInput } from '../schema/product'
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from '../service/product'

const pageNum = 7
export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response
) {
  const userId = res.locals.user._id
  const body = req.body
  const product = await createProduct({ ...body, user: userId })
  return res.send(product)
}

export async function updateProductHandler(
  req: Request<UpdateProductInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id
  const productId = req.params.productId
  const update = req.body
  const product = await findProduct({ productId })
  if (!product) {
    return res.sendStatus(404)
  }
  if (String(product.user) !== userId) {
    return res.sendStatus(403)
  }
  const updatedProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  })

  return res.send(updatedProduct)
}

export async function getProductHandler(
  req: Request<UpdateProductInput['params']>,
  res: Response
) {
  const productId = req.params.productId
  const product = await findProduct({ productId })
  if (!product) {
    return res.sendStatus(404)
  }
  return res.send(product)
}

export async function getProductsHandler(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || pageNum
  const skip = (page - 1) * limit
  const products = await findProduct({ limit, skip })
  return res.send(products)
}

export async function deleteProductHandler(
  req: Request<UpdateProductInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id
  const productId = req.params.productId
  const product = await findProduct({ productId })
  if (!product) {
    return res.sendStatus(404)
  }
  if (String(product.user) !== userId) {
    return res.sendStatus(403)
  }
  await deleteProduct({ productId })
  return res.sendStatus(200)
}
