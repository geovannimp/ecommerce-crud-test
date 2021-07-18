import { NextApiRequest, NextApiResponse } from 'next'
import { ProductDto } from '../../../dto/productDto'
import { prepareConnection } from '../../../lib/database'
import { AuthService } from '../../../service/back/AuthService'
import { ProductService } from '../../../service/back/ProductService'


type UpdateProductResponse = {
  product: ProductDto
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
  res: NextApiResponse<UpdateProductResponse>
) {
  switch (req.method) {
    case 'PUT': return await updateProduct(req, res)
    default: res.status(404).json({ message: 'Not Found' })
  }
}

/**
 * @swagger
 * definitions:
 *   UpdateProductBodyDto:
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
 * /api/products/{productId}:
 *   put:
 *     description: Update product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to edit
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdateProductBodyDto'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ProductDto'
 */
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<UpdateProductResponse>) => {
  const user = AuthService.getUserFromHeaders(req.headers)
  if (user) {
    if (req.query.productId) {
      try {
        const product = await ProductService.updateProduct(req.query.productId as string, req.body)
        res.status(200).json({ product })
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    } else {
      res.status(400).json({ message: 'Invalid body' })
    }
  } else {
    res.status(403).json({ message: 'Forbidden' })
  }
}
