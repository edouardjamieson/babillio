import gsap from 'gsap'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import './../styles/master.css'

function MyApp({ Component, pageProps }) {

  return <Component {...pageProps} />
}

export default MyApp
