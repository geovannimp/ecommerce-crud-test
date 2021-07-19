import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { ProductDto } from '../../dto/productDto'
import { ApiService } from '../../service/front/ApiService'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { toast, ToastContainer } from 'react-toastify'
import { Select } from '../../components/Select'

function Index() {
  const router = useRouter()

  const [product, setProduct] = React.useState<Omit<ProductDto, 'id'>>({
    description: '',
    name: '',
    isPublished: false,
    price: 0
  })

  const [isNewProduct, setIsNewProduct] = React.useState<boolean>(true)

  const setDescription = React.useCallback((description: string) => {
    setProduct(p => ({
      ...p,
      description
    }))
  }, [])

  const setName = React.useCallback((name: string) => {
    setProduct(p => ({
      ...p,
      name
    }))
  }, [])

  const setPrice = React.useCallback((price: string) => {
    setProduct(p => ({
      ...p,
      price: Number(price)
    }))
  }, [])

  const setIsPublished = React.useCallback((isPublished: string) => {
    setProduct(p => ({
      ...p,
      isPublished: isPublished === 'true'
    }))
  }, [])

  const save = React.useCallback(async () => {
    try {
      if (isNewProduct) {
        await ApiService.addProduct(product)
      } else {
        await ApiService.editProduct(router.query.productId as string, product)
      }
      router.push('/products')
    } catch (e) {
      toast.error(e.message, { autoClose: 5000 })
    }
  }, [product, router, isNewProduct])

  React.useEffect(() => {
    if (router.query.productId) {
      setIsNewProduct(
        router.query.productId === 'new'
      )
    }
  }, [router])

  React.useEffect(() => {
    if (!isNewProduct) {
      ApiService
        .loadProduct(router.query.productId as string)
        .then(setProduct)
        .catch(e => {
          toast.error(e.message, { autoClose: 5000 })
        })
    }
  }, [isNewProduct, router])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Ecommerce Crud - Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Card>
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              {
                isNewProduct
                  ? 'New Product'
                  : 'Edit Product'
              }
            </h2>
          </div>
          <div className="shadow-sm my-8 -space-y-px">
            <Input
              type="text"
              value={product.name}
              onChange={setName}
              round='top'
              placeholder="Name"
            />
            <Input
              type="text"
              value={product.description}
              onChange={setDescription}
              placeholder="Description"
            />
            <Select
              value={product.isPublished}
              onChange={setIsPublished}
              placeholder="Is Published?"
              options={[
                {
                  label: 'Yes',
                  value: 'true'
                },
                {
                  label: 'No',
                  value: 'false',
                }
              ]}
            />
            <Input
              type="number"
              value={product.price}
              onChange={setPrice}
              round='bottom'
              placeholder="Price"
            />
          </div>

          <div className='flex gap-6'>
            <Button
              text='Save'
              type='primary'
              onClick={save}
            />
          </div>
        </Card>
        <ToastContainer />
      </main>
    </div>
  )
}

export default Index
