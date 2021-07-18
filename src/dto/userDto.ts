import { User } from "../entities/User"

export interface UserDto {
  id:  string | number
  email: string
  token?: string
}

export const userToDto = (user: User): UserDto => {
  return {
    id: user.id,
    email: user.email,
  }
}
