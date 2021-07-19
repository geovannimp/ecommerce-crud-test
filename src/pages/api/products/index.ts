import { NextApiRequest, NextApiResponse } from 'next'
import { ProductDto } from '../../../dto/productDto'
import { prepareConnection } from '../../../lib/database'
import { AuthService } from '../../../service/back/AuthService'
import { ProductService } from '../../../service/back/ProductService'


type CreateProductResponse = {
  product: ProductDto
} | {
  message: string
}

type GetProductsResponse = {
  products: ProductDto[]
} | {
  message: string
}

/**
 * @swagger
 * definitions:
 *   ProductDto:
 *     required:
 *       - name
 *       - description
 *       - price
 *       - isPublished
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       price:
 *         type: number
 *       isPublished:
 *         type: boolean
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetProductsResponse | CreateProductResponse>
) {
  switch (req.method) {
    case 'POST': return await createProduct(req, res)
    case 'GET': return await getProducts(req, res)
    default: res.status(404).json({ message: 'Not Found' })
  }
}

/**
 * @swagger
 * definitions:
 *   CreateProductBodyDto:
 *     required:
 *       - name
 *       - description
 *       - price
 *       - isPublished
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       price:
 *         type: number
 *       isPublished:
 *         type: boolean
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Product]
 *     description: Create product
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateProductBodyDto'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ProductDto'
 */
const createProduct = async (req: NextApiRequest, res: NextApiResponse<CreateProductResponse>) => {
  const user = AuthService.getUserFromRequest(req, res)
  if (user) {
    if (req.body.name && req.body.description && req.body.price !== undefined) {
      const product = await ProductService.createProduct(req.body, user)
      res.status(200).json({ product })
    } else {
      res.status(400).json({ message: 'Invalid body' })
    }
  } else {
    res.status(403).json({ message: 'Forbidden' })
  }
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Product]
 *     description: Get products
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ProductDto'
 */
const getProducts = async (req: NextApiRequest, res: NextApiResponse<GetProductsResponse>) => {
  const user = AuthService.getUserFromRequest(req, res)

  if (user) {
    const products = await ProductService.getProductsByUserId(user.id)
    res.status(200).json({ products })
  } else {
    res.status(403).json({ message: 'Forbidden' })
  }
}
