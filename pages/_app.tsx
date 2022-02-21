import '../styles/globals.css'
import { initAppUtils } from '../utils/app-utils'
import { AppProps } from 'next/app'

initAppUtils()

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <div id="modal-root" />
    <Component {...pageProps} />
  </>
}

export default MyApp
