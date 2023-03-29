import Head from 'next/head';
import Button from '@mui/material/Button';
import styles from '../styles/Home.module.css';

export default function App() {
  return (
    <>
      <Head>
        <title>Rocketship</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* hero section */}
      <div>
        <div className={styles.imgContainer}>
          <img className={styles.logo} src="/images/logo.png" alt="logo" />
          <img className={styles.landingImg} src="/images/galaxy.jpg" alt="galaxy" />
          <Button variant="contained" className={styles.login}>
            <a href="/api/auth/login"></a>
            Sign Up / Login
          </Button>
        </div>

        <div className={styles.landingText}>
          <h1>Create and fund projects that are </h1>
          <h1>out of this world.</h1>
          <h2 className={styles.h2title}>
            <span className={styles.bold}>RocketShip</span> is a new thing in the future, where you
            can enjoy the virtual world by feeling like it's really real, you can feel what you feel
            in this metaverse world, because this is really the madness of the metaverse of today.
          </h2>
        </div>

        <div className={styles.objects}>
          <img className={styles.objectRocket} src="/images/rocket.png" width="40px" />
          <div>
            <img className={styles.objectEarth} src="/images/earth.png" width="100px" />
            <img className={styles.objectMoon} src="/images/moon.png" width="40px" />
          </div>
          <div className={styles.boxAstronaut}>
            <img className={styles.objectAstronaut} src="/images/astronaut.png" width="140px" />
          </div>
        </div>
      </div>
      {/* about section  */}
      <div className={styles.about}>
        <div className={styles.gradient} />
        <div>You can be a project owner, contributor or funder at RocketShip:</div>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <img className={styles.cardImg} src="/images/planet-01.png" alt="planet1" />
            <h2>Project Owner</h2>
            <div class="details">
              <p>More details about card 1</p>
            </div>
          </div>
          <div className={styles.card}>
            <img className={styles.cardImg} src="/images/planet-02.png" alt="planet2" />
            <h2>Contributor</h2>
            <div class="details">
              <p>More details about card 1</p>
            </div>
          </div>
          <div className={styles.card}>
            <img className={styles.cardImg} src="/images/planet-03.png" alt="planet3" />
            <h2>Fund this Ship</h2>
            <div class="details">
              <p>More details about card 1</p>
            </div>
          </div>
        </div>
      </div>
      {/* map section  */}
      <div className={styles.mapContainer}>
        <h2 className={styles.h3title}>
          Together, we can make a greater impact. Join your fellow astronauts on the RocketShip.
        </h2>
        <img className={styles.map} src="/images/map.png" alt="map" />
      </div>
      {/* get started section  */}
      <div className={styles.getStarted}>
        <h2 className={styles.h3title}>Get started with just a few clicks</h2>
        <img className={styles.planet} src="/images/get-started.png" alt="get-started" />
      </div>
      {/* footer */}
      <footer className={styles.footer}>Copyright © Rocketship 2023</footer>;
      <style js global>
        {`
          body {
            background: #21325e;
          }
        `}
      </style>
    </>
  );
}
