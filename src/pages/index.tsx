import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import React from 'react'

function Index() {
  const router = useRouter()

  React.useEffect(() => {
    router.replace('/login')
  }, [router])
  return <></>
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: `/login`, props: {} }
}

export default Index
