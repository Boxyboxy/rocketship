import Head from "next/head";
import Button from "@mui/material/Button";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import config from "../config";
import { useAuth0 } from "@auth0/auth0-react";
import AnimateNumbers from "../components/animateNumbers";

export default function App() {
  const [projects, setProjects] = useState(0);
  const [contributors, setContributors] = useState(0);
  const [funded, setFunded] = useState("$0");
  const [fundAmt, setFundAmt] = useState(0);
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await axios.get(`${config.apiUrl}/projects`);
        setProjects(projects.data.length);
      } catch (error) {
        console.error("Failed to fetch number of projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const contributions = await axios.get(`${config.apiUrl}/contributions`);
        setContributors(contributions.data.length);
      } catch (error) {
        console.error("Failed to fetch amount funded:", error);
      }
    };

    fetchContributors();
  }, []);
  useEffect(() => {
    const fetchFunded = async () => {
      try {
        const fundingsSum = await axios.get(`${config.apiUrl}/fundings/sumAll`);
        setFunded("$" + fundingsSum.data);
        setFundAmt(fundingsSum.data);
      } catch (error) {
        console.error("Failed to fetch amount funded:", error);
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

          <Button
            variant="contained"
            className={styles.login}
            // onClick={() => loginWithRedirect()}
          >
            <a
              href="/api/auth/login"
              style={{ textDecoration: "none", color: "white" }}
            >
              Sign Up / Login
            </a>
            {/* <a style={{ textDecoration: "none", color: "white" }}>
              Sign Up / Login
            </a> */}
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
        <h2 className={styles.h3title}>
          You can be an astronaut, contributor or backer at RocketShip!
        </h2>
        <div className={styles.cardContainer}>
          <div className={styles.aboutCard}>
            <div className={styles.front}>
              <img
                className={styles.cardImg}
                src="/images/planet-01.png"
                alt="planet1"
              />
              <h2>Astronaut</h2>
            </div>
            <div className={styles.back}>
              <div className={styles.backTxt}>
                <h2>Be the Captain of your own crowdfunding adventure!</h2>
                <p>
                  Create and launch your dream projects while connecting with
                  talented individuals who can help you make it soar to new
                  heights.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.aboutCard}>
            <div className={styles.front}>
              <img
                className={styles.cardImg}
                src="/images/planet-02.png"
                alt="planet2"
              />
              <h2>Contributor</h2>
            </div>
            <div className={styles.back}>
              <div className={styles.backTxt}>
                <h2>Join the Crew!</h2>
                <p>
                  Explore and collaborate on cutting-edge crowdfunding projects
                  that align with your skills and passions, and be part of a
                  dynamic team working towards a common goal.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.aboutCard}>
            <div className={styles.front}>
              <img
                className={styles.cardImg}
                src="/images/planet-03.png"
                alt="planet3"
              />
              <h2>Backer</h2>
            </div>
            <div className={styles.back}>
              <div className={styles.backTxt}>
                <h2>Fuel the Innovation!</h2>
                <p>
                  Support groundbreaking projects by contributing funds and
                  become a valued backer, playing a crucial role in bringing
                  bold and innovative ideas to life.
                </p>
              </div>
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
              <div className={styles.stats}>
                <AnimateNumbers n={projects} />
              </div>
              <p>projects launched</p>
            </div>
            <div className={styles.numSummary}>
              <div className={styles.stats}>
                <AnimateNumbers n={contributors} />
              </div>
              <p>contributors</p>
            </div>
            <div className={styles.numSummary}>
              <div className={styles.stats}>
                <AnimateNumbers n={fundAmt} />
              </div>
              <p>dollars raised</p>
            </div>
          </div>
        </div>
      </div>
      {/* get started section  */}
      <h2 className={styles.h3title}>Get started with just a few clicks!</h2>
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
      <Button className={styles.bottomLogin} variant="contained">
        <a
          href="/api/auth/login"
          style={{ textDecoration: "none", color: "white" }}
        >
          🚀 Enter The Rocketship!
        </a>
      </Button>
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
