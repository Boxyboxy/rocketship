// pages/_app.js
import React from "react";
import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Auth0Provider } from "@auth0/auth0-react";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
