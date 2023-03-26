// pages/_app.js
import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </UserProvider>
  );
}
