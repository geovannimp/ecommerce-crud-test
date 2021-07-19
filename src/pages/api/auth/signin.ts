import { NextApiRequest, NextApiResponse } from 'next'
import { UserDto } from '../../../dto/userDto'
import { AuthService } from '../../../service/back/AuthService'
import Cookies from 'cookies'

type SignInResponse = {
  user: UserDto
} | {
  message: string
}


/**
 * @swagger
 * definitions:
 *   SignInBodyDto:
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
 *       - token
 *     properties:
 *       email:
 *         type: string
 *       token:
 *         type: string
 */

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags: [Auth]
 *     description: Login in an user
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/SignInBodyDto'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserDto'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignInResponse>
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'Not Found' })
  } else if (!(req.body.email && req.body.password)) {
    res.status(400).json({ message: 'Invalid body' })
  } else {
    try {
      const user = await AuthService.login(req.body.email, req.body.password)
      const cookies = new Cookies(req, res)
      cookies.set('auth-token', user.token, {
          httpOnly: true,
          sameSite: 'lax'
      })
      res.status(200).json({ user })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }

}
