import { Product } from "../entities/Product"
import { ProductPhoto } from "../entities/ProductPhoto"

export interface ProductPhotoDto {
  id: number
  productId: string
  url: string
}

export const productPhotoToDto = (productPhoto: ProductPhoto): ProductPhotoDto => {
  return {
    id: productPhoto.id,
    productId: productPhoto.productId,
    url: productPhoto.url,
  }
}
