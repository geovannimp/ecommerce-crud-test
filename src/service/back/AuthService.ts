import * as bcrypt from 'bcrypt'
import { EmailTypes, MailService } from "./MailService"
import { v4 as uuidv4 } from 'uuid'
import { User } from '../../entities/User'
import { prepareConnection } from '../../lib/database'
import { UserDto, userToDto } from '../../dto/userDto'
import jwt from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http'


class AuthServiceImpl {

  private readonly SALT_ROUNDS = 10
  private readonly JWT_PRIVATE_SECRET: string

  constructor() {
    this.JWT_PRIVATE_SECRET = process.env.JWT_PRIVATE_SECRET!
  }

  isTokenValid(token?: string) {
    return !!(token && token.includes('bearer '))
  }

  async getHashedPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async checkPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  }

  private isUserValid(user?: User) {
    return !!(
      user
      && !user.confirmationToken
    )
  }

  async login(email: string, password: string): Promise<UserDto> {
    await prepareConnection()

    const user = await User.findOne({
      where: {
        email : email
      }
    })

    if (user && this.isUserValid(user) && await this.checkPassword(password, user.passwordHash)) {
      const dtoUser = userToDto(user)
      const token = jwt.sign(dtoUser, this.JWT_PRIVATE_SECRET, {
        expiresIn: '1y',
        jwtid: uuidv4()
      })
      return {
        ...dtoUser,
        token: token,
      }
    } else {
      throw new Error('User not found')
    }
  }

  getUserFromHeaders(headers: IncomingHttpHeaders) {
    if (headers.authorization?.includes('Bearer ')) {
      const token = headers['authorization'].split(' ')[1]
      return this.getUserFromToken(token)
    }
  }

  getUserFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_PRIVATE_SECRET) as (jwt.JwtPayload & UserDto)
      return decoded
    } catch {
      return undefined
    }
  }

  private getConfirmationLink(user: User) {
    return `http://${process.env.HOST}${process.env.PORT ? ':'+process.env.PORT : ''}/confirm-email/${user.confirmationToken}`
  }

  async confirmEmail(confirmationToken: string) {
    await prepareConnection()

    const user = await User.findOne({
      where: { confirmationToken }
    })

    if (user) {
      user.confirmationToken = null
      await user.save()
      return userToDto(user)
    } else {
      throw new Error('Invalid token')
    }
  }

  async createUser(email: string, password: string): Promise<UserDto> {
    await prepareConnection()
    if (await User.findOne({ where: { email } })) {
      throw new Error('User already registered')
    } else {
      const newUser = new User()
      newUser.email = email
      newUser.confirmationToken = uuidv4()
      newUser.passwordHash = await this.getHashedPassword(password)
      const queuedEmail = await MailService.addEmailToQueue(EmailTypes.AccountConfirmation, email, {
        confirmationLink: this.getConfirmationLink(newUser)
      })
      await newUser.save()
      MailService.sendQueuedEmail(queuedEmail)
      return userToDto(newUser)
    }
  }

}

export const AuthService = new AuthServiceImpl()
