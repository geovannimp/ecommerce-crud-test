import { GetServerSideProps } from 'next'
import React from 'react'
import { ApiService } from '../../service/front/ApiService'

function ConfirmEmail(props: { error?: string }) {
  return <div>{props.error}</div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const confirmationToken = context.query.token as string
  try {
    await ApiService.confirmEmail(confirmationToken)
    return { redirect: `/login`, props: {} }
  } catch (e) {
    return { props: {
      error: e.message
    }}
  }
}

export default ConfirmEmail
