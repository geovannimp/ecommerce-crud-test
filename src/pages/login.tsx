import { useRouter } from 'next/dist/client/router'
import { route } from 'next/dist/next-server/server/router'
import Head from 'next/head'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { ApiService } from '../service/front/ApiService'

export default function Home() {
  const router = useRouter()

  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')

  React.useEffect(() => {
    if (router.query.emailVerified === 'true') {
      toast.success('Email was confirmed', { autoClose: 10000 })
    }
  }, [router])

  const signIn = React.useCallback(async () => {
    try {
      if (email && password) {
        await ApiService.signIn(email, password)
        router.push('/products')
      } else {
        throw new Error('Email or password is empty')
      }
    } catch (e) {
      toast.error(e.message, { autoClose: 5000 })
    }
  }, [email, password, router])

  const signUp = React.useCallback(async () => {
    try {
      if (email && password) {
        const user = await ApiService.signUp(email, password)
        toast.success('Confirmation email was sent', { autoClose: 10000 })
      } else {
        throw new Error('Email or password is empty')
      }
    } catch (e) {
      toast.error(e.message, { autoClose: 5000 })
    }
  }, [email, password])

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
              Sign
            </h2>
          </div>
          <div className="shadow-sm my-8 -space-y-px">
            <Input
              type="email"
              value={email}
              onChange={setEmail}
              round='top'
              placeholder="Email address"
            />
            <Input
              type="password"
              value={password}
              onChange={setPassword}
              round='bottom'
              placeholder="Password"
            />
          </div>

          <div className='flex gap-6'>
            <Button
              text='Sign up'
              type='secondary'
              onClick={signUp}
            />
            <Button
              text='Sign in'
              type='primary'
              onClick={signIn}
            />
          </div>
        </Card>
        <ToastContainer />
      </main>
    </div>
  )
}
