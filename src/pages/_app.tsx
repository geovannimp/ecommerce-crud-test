import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/docs.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
