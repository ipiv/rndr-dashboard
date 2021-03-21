import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StyledDropzone from "../components/StyledDropzone";
import Statistics from "../components/Statistics";
import { useState } from "react";

export default function Home() {
  const [logData, setLogData] = useState(false);
  const handleLogData = (data) => {
    setLogData(data)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>RNDR dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to <a href="https://rendertoken.com/" target="_blank" rel="noopener noreferrer">RNDR</a> dashboard!*
          </h1>

          <p className={styles.description}>
            Personal project! {' '}
            <code className={styles.code}>*not affiliated with <a href="https://home.otoy.com/" target="_blank" rel="noopener noreferrer">OTOY</a></code>
          </p>
        </div>
        { logData ? 
          <Statistics logData={logData} />
          :
          <StyledDropzone handleLogData={handleLogData}/>
        }
      </main>

      <footer className={styles.footer}>
        <div>☕Eth: 0x5251dc3700164ed4a1Af9d3f86e8259d1eBea502</div>
        <div className={styles.footerlinks}>
          <a href="https://twitter.com/ipivDev" target="_blank" rel="noopener noreferrer">
            <p>Made with 💙 by ipiv</p>
          </a>
          <a href="https://github.com/ipiv/rndr-dashboard" target="_blank" rel="noopener noreferrer" className={styles.github}>
            <img src="/github.svg" alt="Github Logo"/>
            <p>Github</p>
          </a>
        </div>
      </footer>
    </div>
  )
}
