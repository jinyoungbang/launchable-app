import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { Input } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import Header from "../components/main/Header";


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>새 글 작성</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Input placeholder='Enter Title Here' size='lg' />
      <br />
      <br />
      <Textarea placeholder='Here is a sample placeholder' />
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
