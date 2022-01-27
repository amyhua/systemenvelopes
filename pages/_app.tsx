import '../styles/globals.css'
import { initAppUtils } from '../utils/app-utils'
import { AppProps } from 'next/app'

initAppUtils()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
