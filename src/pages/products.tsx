import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { ProductDto } from '../dto/productDto'
import { ApiService } from '../service/front/ApiService'

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
        <ToastContainer />
      </main>
    </div>
  )
}
