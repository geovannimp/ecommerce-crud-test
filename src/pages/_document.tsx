import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html className='dark'>
        <Head />
        <body className='bg-white dark:bg-black dark:text-white dark:text-opacity-90'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
