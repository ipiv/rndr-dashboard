import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StyledDropzone from "../components/StyledDropzone";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>RNDR dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{margin: '2.2em'}}>
          <h1 className={styles.title}>
            Welcome to <a href="https://rendertoken.com/">RNDR</a> dashboard!
          </h1>

          <p className={styles.description}>
            Personal project! {' '}
            <code className={styles.code}>*not affiliated with <a href="https://home.otoy.com/">OTOY</a></code>
          </p>
        </div>

        <StyledDropzone />

      </main>

      <footer className={styles.footer}>
        <div>☕Eth: 0x5251dc3700164ed4a1Af9d3f86e8259d1eBea502</div>
        <a
          href="https://twitter.com/ipivDev"
          target="_blank"
          rel="noopener noreferrer"
        >
          
          {<p>Made with 💙 by ipiv</p>/* <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} /> */}
        </a>
      </footer>
    </div>
  )
}
