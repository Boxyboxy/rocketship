// pages/_app.js
import React from "react";
import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Auth0Provider } from "@auth0/auth0-react";

export default function App({ Component, pageProps }) {
  console.log(process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL);
  return (
    // <Auth0Provider
    //   domain={process.env.NEXT_PUBLIC_REACT_AUTH0_DOMAIN}
    //   clientId={process.env.NEXT_PUBLIC_REACT_AUTH0_CLIENT_ID}
    //   authorizationParams={{
    //     redirect_uri: "http://localhost:3000/projects",
    //   }}
    // >   <Component {...pageProps} /> </Auth0Provider>
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
