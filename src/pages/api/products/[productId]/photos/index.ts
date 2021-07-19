import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../../../service/back/AuthService'
import { ProductService } from '../../../../../service/back/ProductService'
import formidable from 'formidable'
import { ProductPhotoDto } from '../../../../../dto/productPhotoDto'



type AddProductPhotoResponse = {
  productPhoto: ProductPhotoDto
} | {
  message: string
}

type GetProductPhotosResponse = {
  productPhotos: ProductPhotoDto[]
} | {
  message: string
}

export const config = {
  api: {
    bodyParser: false,
  },
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
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetProductPhotosResponse | AddProductPhotoResponse>
) {
  switch (req.method) {
    case 'GET': return await getProductPhotos(req, res)
    case 'POST': return await addProductPhoto(req, res)
    default: res.status(404).json({ message: 'Not Found' })
  }
}


/**
 * @swagger
 * /api/products/{productId}/photos:
 *   get:
 *     tags: [ProductPhoto]
 *     description: Get product photos
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get photos
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ProductPhotoDto'
 */
const getProductPhotos = async (req: NextApiRequest, res: NextApiResponse<GetProductPhotosResponse>) => {
  const user = AuthService.getUserFromHeaders(req.headers)

  if (user) {
    if (req.query.productId) {
      try {
        const productPhotos = await ProductService.getProductsPhotos(user.id, req.query.productId as string)
        res.status(200).json({ productPhotos })
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  } else {
    res.status(403).json({ message: 'Forbidden' })
  }
}

/**
 * @swagger
 * definitions:
 *   AddProductPhotoBodyDto:
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
 * /api/products/{productId}/photos:
 *   post:
 *     tags: [ProductPhoto]
 *     description: Add photo to product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to add photo
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ProductPhotoDto'
 */
const addProductPhoto = async (req: NextApiRequest, res: NextApiResponse<AddProductPhotoResponse>) => {
  const user = AuthService.getUserFromHeaders(req.headers)
  if (user) {
    if (req.query.productId) {
      try {
        const photo = await getFileFromRequest(req)
        if (photo) {
          const productPhoto = await ProductService.addProductPhoto(user.id, req.query.productId as string, photo.path)
          res.status(200).json({ productPhoto })
        } else {
          res.status(400).json({ message: 'Invalid photo' })
        }
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

const getFileFromRequest = async (req: NextApiRequest): Promise<formidable.File> => {
  return new Promise((resolve, reject) => {
    formidable().parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      } else {
        const file = Object.values(files)[0]
        if (Array.isArray(file)) {
          reject(new Error('Only one file accepted'))
        } else {
          resolve(file)
        }
      }
    })
  })
}
