import '../styles/globals.css'
import { init } from '../utils/sentry'

init()

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
