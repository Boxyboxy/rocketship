import Head from "next/head";
import Image from "next/image";

export default function PersonalProfilePage() {
  return (
    <>
      <p> This is the personal profile page with all the projects.</p>
      <p> This will be the navbar.</p>

      <a href="/api/auth/logout">Logout</a>
    </>
  );
}
