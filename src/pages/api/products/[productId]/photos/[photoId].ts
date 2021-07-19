import { NextApiRequest, NextApiResponse } from 'next'
import { ProductPhotoDto } from '../../../../../dto/productPhotoDto'
import { AuthService } from '../../../../../service/back/AuthService'
import { ProductService } from '../../../../../service/back/ProductService'


type DeleteProductPhotoResponse = {
  productPhoto: ProductPhotoDto
} | {
  message: string
}


/**
 * @swagger
 * definitions:
 *   ProductPhotoDto:
 *     required:
 *       - id: number
 *       - productId: string
 *       - url: string
 *     properties:
 *       id:
 *         type: number
 *       productId:
 *         type: string
 *       url:
 *         type: string
 */

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
  res: NextApiResponse<DeleteProductPhotoResponse>
) {
  switch (req.method) {
    case 'DELETE': return await deleteProductPhoto(req, res)
    default: res.status(404).json({ message: 'Not Found' })
  }
}

/**
 * @swagger
 * /api/products/{productId}/photos/{photoId}:
 *   delete:
 *     tags: [ProductPhoto]
 *     description: Delete product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to delete photo
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the photo to delete
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ProductPhotoDto'
 */
const deleteProductPhoto = async (req: NextApiRequest, res: NextApiResponse<DeleteProductPhotoResponse>) => {
  const user = AuthService.getUserFromHeaders(req.headers)
  if (user) {
    if (req.query.productId && req.query.photoId) {
      try {
        const productPhoto = await ProductService.deleteProductPhoto(
          user.id,
          req.query.productId as string,
          req.query.photoId as string
        )
        res.status(200).json({ productPhoto })
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    } else {
      res.status(400).json({ message: 'Invalid path' })
    }
  } else {
    res.status(403).json({ message: 'Forbidden' })
  }
}
