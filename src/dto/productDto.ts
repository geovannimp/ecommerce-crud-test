import { Product } from "../entities/Product"

export interface ProductDto {
  id: number
  name: string
  description: string
  price: number
  isPublished: boolean
}

export const productToDto = (product: Product): ProductDto => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    isPublished: !!product.publishedAt,
  }
}
