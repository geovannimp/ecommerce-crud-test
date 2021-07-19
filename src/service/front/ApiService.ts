import axios from 'axios'
import { ProductDto } from '../../dto/productDto'
import { UserDto } from '../../dto/userDto'

class ApiServiceImpl {

  private readonly API_URL: string

  constructor() {
    const API_HOST = process.env.NEXT_PUBLIC_API_HOST
    const API_PORT = process.env.NEXT_PUBLIC_API_PORT
    this.API_URL = `http://${API_HOST}${API_PORT ? ':'+API_PORT : ''}/api`
  }

  async confirmEmail(confirmationToken: string) {
    return new Promise((resolve,reject) => {
      const endpoint = `${this.API_URL}/auth/confirm`
      axios.post(endpoint, {
        confirmationToken
      })
        .then(r => r.data)
        .then(resolve)
        .catch(e => {
          reject(new Error(e.response.data.message))
        })
    })
  }

  async signIn(email: string, password: string): Promise<UserDto> {
    return new Promise((resolve,reject) => {
      const endpoint = `${this.API_URL}/auth/signin`
      axios.post(endpoint, {
        email, password
      })
        .then(r => r.data.user)
        .then(resolve)
        .catch(e => {
          reject(new Error(e.response.data.message))
        })
    })
  }

  async signUp(email: string, password: string): Promise<UserDto> {
    return new Promise((resolve,reject) => {
      const endpoint = `${this.API_URL}/auth/signup`
      axios.post(endpoint, {
        email, password
      })
        .then(r => r.data.user)
        .then(resolve)
        .catch(e => {
          reject(new Error(e.response.data.message))
        })
    })
  }

  async getProducts(): Promise<ProductDto[]> {
    return new Promise((resolve,reject) => {
      const endpoint = `${this.API_URL}/products`
      axios.get(endpoint)
        .then(r => r.data.products)
        .then(resolve)
        .catch(e => {
          reject(new Error(e.response.data.message))
        })
    })
  }

  async addProduct(product: Omit<ProductDto, 'id'>): Promise<ProductDto> {
    return new Promise((resolve,reject) => {
      const endpoint = `${this.API_URL}/products`
      axios.post(endpoint, product)
        .then(r => r.data.product)
        .then(resolve)
        .catch(e => {
          reject(new Error(e.response.data.message))
        })
    })
  }

  async editProduct(productId: string, product: Omit<ProductDto, 'id'>): Promise<ProductDto> {
    return new Promise((resolve,reject) => {
      const endpoint = `${this.API_URL}/products/${productId}`
      axios.put(endpoint, product)
        .then(r => r.data.product)
        .then(resolve)
        .catch(e => {
          reject(new Error(e.response.data.message))
        })
    })
  }

  async loadProduct(productId: string): Promise<ProductDto> {
    return new Promise((resolve,reject) => {
      const endpoint = `${this.API_URL}/products/${productId}`
      axios.get(endpoint)
        .then(r => r.data.product)
        .then(resolve)
        .catch(e => {
          reject(new Error(e.response?.data?.message))
        })
    })
  }

}

export const ApiService = new ApiServiceImpl()
