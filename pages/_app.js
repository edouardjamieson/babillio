import './../styles/master.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
          <title>Babillio - Chargement...</title>
          <meta name="description" content="Babillio - L'application pour les enseignants et éléves qui révolutionne les cours." />
          <link rel="icon" href="/images/logo_blue.png"/>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
