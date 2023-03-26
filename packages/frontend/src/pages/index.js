import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function App() {
  return (
    <>
      <Head>
        <title>Rocketship</title>
        <meta charset="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-next-app"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      </Head>
      <div>
        <header>
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          <p>This is the welcome page.</p>
          <a href="/api/auth/login">Login</a>
          <br />
        </header>
      </div>
    </>
  );
}
