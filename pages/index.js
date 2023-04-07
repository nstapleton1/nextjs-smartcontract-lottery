import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { Inter } from 'next/font/google'
// import ManualHeader from '../components/ManualHeader'
import Header from '../components/Header'
import LotteryEntrance from '../components/LotteryEntrance'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
      <div className={styles.container}>
        <Head>
            <title>Smart Contract Lottery</title>
            <meta name="description" content="Our Smart Contract Lottery" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {/* <ManualHeader /> */}
          <Header/>
          <LotteryEntrance/>
          Hi Siobhan!
        </div>
  )
}
