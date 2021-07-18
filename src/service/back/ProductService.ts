import { ProductDto, productToDto } from "../../dto/productDto"
import { UserDto } from "../../dto/userDto"
import { Product } from "../../entities/Product"
import { prepareConnection } from "../../lib/database"

class ProductServiceImpl {

  async getProductsByUserId(userId: number) {
    await prepareConnection()
    return (
      await Product.find({ where: { userId } })
    ).map(productToDto)
  }

  async createProduct(product: ProductDto, user: UserDto) {
    await prepareConnection()
    const newProduct = new Product()
    newProduct.name = product.name
    newProduct.description = product.description
    newProduct.price = product.price
    newProduct.userId = user.id
    newProduct.publishedAt = product.isPublished
      ? new Date()
      : undefined
    const savedProduct = await newProduct.save()
    return productToDto(savedProduct)
  }

  async updateProduct(productId: string, product: Partial<ProductDto>) {
    await prepareConnection()

    const dbProduct = await Product.findOne({ where: { id: productId } })

    if (!dbProduct) {
      throw new Error('Product not found')
    }

    Object.keys(product).forEach((key) => {
      if (key === 'isPublished') {
        dbProduct.publishedAt = product.isPublished
          ? new Date()
          : null
      } else {
        // @ts-ignore
        dbProduct[key] = product[key]
      }
    })

    const savedProduct = await dbProduct.save()
    return productToDto(savedProduct)
  }

}

export const ProductService = new ProductServiceImpl()
