import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { RoundButton } from '../../components/RoundButton'
import { ProductDto } from '../../dto/productDto'
import { ApiService } from '../../service/front/ApiService'

export default function Home() {
  const router = useRouter()

  const [products, setProducts] = React.useState<ProductDto[]>([])

  const loadProducts = React.useCallback(() => {
    ApiService.getProducts()
      .then(setProducts)
      .catch(() => {
        router.replace('/login')
      })
  }, [router])

  const goToNewProduct = React.useCallback(() => {
    router.push('/products/new')
  }, [router])

  const editProduct = React.useCallback((product: ProductDto) => {
    router.push(`/products/${product.id}`)
  }, [router])

  React.useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Ecommerce Crud - Products</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold mb-8">
            Products
          </h2>
        </div>
        {(products.map(p => (
          <RoundButton
            key={p.id}
            title={p.name}
            subtitle={p.description}
            onClick={() => editProduct(p)}
          />
        )))}
        <RoundButton
          title='New Product'
          onClick={goToNewProduct}
        />
        <ToastContainer />
      </main>
    </div>
  )
}
