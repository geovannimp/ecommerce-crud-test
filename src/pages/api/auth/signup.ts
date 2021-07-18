import { NextApiRequest, NextApiResponse } from 'next'
import { UserDto } from '../../../dto/userDto'
import { AuthService } from '../../../service/back/AuthService'

type SignUpResponse = {
  user: UserDto
} | {
  message: string
}

/**
 * @swagger
 * definitions:
 *   SignUpBodyDto:
 *     required:
 *       - email
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   UserDto:
 *     required:
 *       - email
 *     properties:
 *       email:
 *         type: string
 *       token:
 *         type: string
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     description: Create a new user at the system
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/SignUpBodyDto'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserDto'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignUpResponse>
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'Not Found' })
  } else if (!(req.body.email && req.body.password)) {
    res.status(400).json({ message: 'Invalid body' })
  } else {
    try {
      const user = await AuthService.createUser(req.body.email, req.body.password)

      res.status(200).json({ user })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }

}
