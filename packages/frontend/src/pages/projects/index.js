import Head from "next/head";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <p> This is the homepage with all the projects.</p>
      <p> This will be the navbar.</p>

      <a href="/api/auth/logout">Logout</a>
    </>
  );
}
