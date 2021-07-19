import { ProductDto, productToDto } from "../../dto/productDto"
import { UserDto } from "../../dto/userDto"
import { Product } from "../../entities/Product"
import { prepareConnection } from "../../lib/database"
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { ProductPhoto } from "../../entities/ProductPhoto"
import { productPhotoToDto } from "../../dto/productPhotoDto"

class ProductServiceImpl {

  private readonly S3
  private readonly S3_PRODUCT_PHOTOS_BUCKET: string

  constructor() {
    this.S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
    this.S3_PRODUCT_PHOTOS_BUCKET = process.env.S3_PRODUCT_PHOTOS_BUCKET!
  }

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

  async updateProduct(userId: number, productId: string, product: Partial<ProductDto>) {
    await prepareConnection()

    const dbProduct = await Product.findOne({ where: { id: productId, userId } })

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

  async deleteProduct(userId: number, productId: string) {
    await prepareConnection()

    const dbProduct = await Product.findOne({ where: { id: productId, userId } })

    if (!dbProduct) {
      throw new Error('Product not found')
    }

    dbProduct.softRemove()

    return productToDto(dbProduct)
  }

  async getProductsPhotos(userId: number, productId: string) {
    await prepareConnection()

    const dbProduct = await Product.findOne({ where: { id: productId, userId } })

    if (!dbProduct) {
      throw new Error('Product not found')
    }

    return (await ProductPhoto.find({ where: { productId } })).map(productPhotoToDto)
  }

  async addProductPhoto(userId: number, productId: string, photoPath: string) {
    await prepareConnection()

    const dbProduct = await Product.findOne({ where: { id: productId, userId } })

    if (!dbProduct) {
      throw new Error('Product not found')
    }

    const newPhoto = new ProductPhoto()
    newPhoto.fileName = `${uuidv4()}.jpeg`
    newPhoto.productId = productId
    newPhoto.url = await this.asyncS3ImageUpload(newPhoto.fileName, photoPath)
    const savedPhoto = await newPhoto.save()

    return productPhotoToDto(savedPhoto)
  }

  async deleteProductPhoto(userId: number, productId: string, photoId: string) {
    await prepareConnection()

    const dbProduct = await Product.findOne({ where: { id: productId, userId } })

    if (!dbProduct) {
      throw new Error('Product not found')
    }

    const dbPhoto = await ProductPhoto.findOne({ where: { productId: productId, id: photoId } })

    if (!dbPhoto) {
      throw new Error('Product photo not found')
    }

    await dbPhoto.remove()
    await this.asyncS3Delete(dbPhoto.fileName)

    return productPhotoToDto(dbPhoto)
  }

  async asyncS3Delete(fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.S3.deleteObject({
        Bucket: this.S3_PRODUCT_PHOTOS_BUCKET,
        Key: fileName,
      }, (err, data) => {
        if (err) {
          reject(err.message)
        } else {
          resolve()
        }
      })
    })
  }

  async asyncS3ImageUpload(imageName: string, imagePath: string): Promise<string> {
    const imageBuffer = await sharp(imagePath)
      .resize(500)
      .jpeg({ mozjpeg: true })
      .toBuffer()

    return new Promise((resolve, reject) => {
      this.S3.upload({
        Bucket: this.S3_PRODUCT_PHOTOS_BUCKET,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        Key: imageName,
        Body: imageBuffer,
        ACL: 'public-read'
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.Location)
        }
      })
    })
  }

}

export const ProductService = new ProductServiceImpl()
