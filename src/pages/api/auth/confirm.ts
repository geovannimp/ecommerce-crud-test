import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../service/back/AuthService'

type ConfirmEmailResponse = {
  success: true
} | {
  message: string
}

/**
 * @swagger
 * definitions:
 *   ConfirmEmailDto:
 *     required:
 *       - confirmationToken
 *     properties:
 *       confirmationToken:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   ConfirmEmailResponse:
 *     required:
 *       - success
 *     properties:
 *       success:
 *         type: boolean
 */

/**
 * @swagger
 * /api/auth/confirm:
 *   post:
 *     description: Confirm user email
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/ConfirmEmailDto'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserDto'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConfirmEmailResponse>
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'Not Found' })
  } else if (!(req.body.confirmationToken)) {
    res.status(400).json({ message: 'Invalid body' })
  } else {
    try {
      await AuthService.confirmEmail(req.body.confirmationToken)

      res.status(200).json({ success: true })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }

}
