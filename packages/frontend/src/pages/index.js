import Head from "next/head";
import Button from "@mui/material/Button";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import { BACKEND_URL } from "../constants/backendUrl";
import { containerClasses } from "@mui/material";
export default function App() {
  const [projects, setProjects] = useState(1234);
  const [contributors, setContributors] = useState(876);
  const [funded, setFunded] = useState("$543");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await axios.get(`${BACKEND_URL}/projects`);
        setProjects(projects.data.length);
      } catch (error) {
        console.error("Failed to fetch number of projects:", error);
      }
    };

    fetchProjects();
  }, []);
  useEffect(() => {
    const fetchFunded = async () => {
      try {
        const fundingsSum = await axios.get(`${BACKEND_URL}/fundings/sumAll`);
        setFunded("$" + fundingsSum.data);
      } catch (error) {
        console.error("Failed to fetch amount dunded:", error);
      }
    };

    fetchFunded();
  }, []);

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
          <img
            className={styles.landingImg}
            src="/images/galaxy.jpg"
            alt="galaxy"
          />
          <Button variant="contained" className={styles.login}>
            <a
              href="/api/auth/login"
              style={{ textDecoration: "none", color: "white" }}
            >
              Sign Up / Login
            </a>
          </Button>
        </div>

        <div className={styles.landingText}>
          <h1>Create and fund projects that are </h1>
          <h1>out of this world.</h1>
          <h2 className={styles.h2title}>
            <span className={styles.bold}>RocketShip</span> is your ticket to
            launch your wildest ideas into the orbit!
            <p>
              Our cutting-edge crowdfunding platform is designed exclusively for
              software engineers who want to take their creations to new heights
              with the power of community support.
            </p>
            <p>
              Join us on this exhilarating journey to bring the future to life!
            </p>
            <p>
              <ArrowDownwardIcon />
            </p>
          </h2>
        </div>

        <div className={styles.objects}>
          <img
            className={styles.objectRocket}
            src="/images/rocket.png"
            width="40px"
          />
          <div>
            <img
              className={styles.objectEarth}
              src="/images/earth.png"
              width="100px"
            />
            <img
              className={styles.objectMoon}
              src="/images/moon.png"
              width="40px"
            />
          </div>
          <div className={styles.boxAstronaut}>
            <img
              className={styles.objectAstronaut}
              src="/images/astronaut.png"
              width="140px"
            />
          </div>
        </div>
      </div>
      {/* about section  */}
      <div className={styles.about}>
        <div className={styles.gradient} />
        <h2 className={styles.h3title}>
          You can be a project owner, contributor or funder at RocketShip:
        </h2>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <img
              className={styles.cardImg}
              src="/images/planet-01.png"
              alt="planet1"
            />
            <h2>Project Owner</h2>
            <div className={styles.details}>
              <p>More details about card 1</p>
            </div>
          </div>
          <div className={styles.card}>
            <img
              className={styles.cardImg}
              src="/images/planet-02.png"
              alt="planet2"
            />
            <h2>Contributor</h2>
            <div class="details">
              <p>More details about card 2</p>
            </div>
          </div>
          <div className={styles.card}>
            <img
              className={styles.cardImg}
              src="/images/planet-03.png"
              alt="planet3"
            />
            <h2>Fund this Ship</h2>
            <div class="details">
              <p>More details about card 3</p>
            </div>
          </div>
        </div>
      </div>
      {/* map section  */}
      <div className={styles.mapContainer}>
        <h2 className={styles.mapTitle}>
          Together, we can make a greater impact.
        </h2>
        <h2 className={styles.mapTitle}>
          Join your fellow astronauts on the RocketShip.
        </h2>
        <div className={styles.mapNumbers}>
          <img className={styles.map} src="/images/map.png" alt="map" />
          <div className={styles.numbersContainer}>
            <div className={styles.numSummary}>
              <p>{projects}</p>
              <p>Projects</p>
            </div>
            <div className={styles.numSummary}>
              <p>{contributors}</p>
              <p>Contributors</p>
            </div>
            <div className={styles.numSummary}>
              <p>{funded}</p>
              <p>Raised</p>
            </div>
          </div>
        </div>
      </div>
      {/* get started section  */}
      <h2 className={styles.h3title}>Get started with just a few clicks</h2>
      <div className={styles.getStarted}>
        <ul className={styles.bullets}>
          <li className={styles.bulletpoint}>
            <p className={styles.number}>1</p>
            <p className={styles.gsTxt}>
              Sign up as an astronaut to enter the RocketShip
            </p>
          </li>

          <li className={styles.bulletpoint}>
            <p className={styles.number}>2</p>
            <p className={styles.gsTxt}>
              Explore the space for projects that interest you
            </p>
          </li>

          <li className={styles.bulletpoint}>
            <p className={styles.number}>3</p>
            <p className={styles.gsTxt}>
              Fund a ship or help your fellow astronauts with your skills!
            </p>
          </li>
        </ul>
        <img
          className={styles.planet}
          src="/images/get-started.png"
          alt="get-started"
        />
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
