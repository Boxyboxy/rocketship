import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import NavBar from "../../components/navbar";
import Category from "../../components/category";
import axios from "axios";

export default function HomePage() {
  // const [numOfProjects, setNumOfProjects] = useState(1238);
  // const [numOfContributers, setNumOfContributers] = useState("8723");
  // const [fundSum, setFundSum] = useState("123,000");
  const [projectsArray, setProjectsArray] = useState([]);
  const [featuredProject, setFeaturedProject] = useState();

  const [stats, setStats] = useState([
    { statName: "Projects", sum: "3456" },
    { statName: "Contributers", sum: "9877" },
    { statName: "Funded", sum: "$124,600" },
  ]);

  // fetching projects w/ the user names from userId field
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:8080/projects"),
          axios.get("http://localhost:8080/users"),
        ]);
        const usersMap = new Map(
          usersResponse.data.map((user) => [user.id, user.name])
        );
        const projects = projectsResponse.data.map((project) => {
          return {
            ...project,
            userName: usersMap.get(project.userId),
          };
        });
        setProjectsArray(projects);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjects().then(console.log(projectsArray));
  }, []);

  //math random to generate a featured project
  useEffect(() => {
    // adding 0.1 to avoid the chance that we get a zero
    const featuredProjectId = Math.round(
      (Math.random() + 0.1) * projectsArray.length
    );
    console.log(featuredProjectId);
    const featured = projectsArray[featuredProjectId];
    setFeaturedProject(featured);
  }, [projectsArray]);

  return (
    <div>
      <Head>
        <title>Discover Projects</title>
      </Head>
      <div>
        <NavBar />
        <Category />
      </div>
      <div>
        <h3> Featured </h3>
        {featuredProject && (
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={7} lg={6}>
              <img src={featuredProject.coverImage} width={500} />
            </Grid>
            <Grid xs={12} sm={12} md={5} lg={6}>
              <div>
                <h2>{featuredProject.name}</h2>
                <p>{featuredProject.description}</p>
                <p> To be created by: {featuredProject.userName}</p>
              </div>
            </Grid>
          </Grid>
        )}
        <Grid container spacing={1} sx={{ margin: "10%" }}>
          {stats.map((stat) => {
            return (
              <Grid xs={12} sm={4} md={4} lg={4} sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "3rem", color: "#3E497A" }}>
                  {stat.sum}
                </Typography>
                <Typography sx={{ fontSize: 20 }}>{stat.statName}</Typography>
              </Grid>
            );
          })}
        </Grid>
        <h1>Trending Projects</h1>
        <Grid container spacing={2}>
          {projectsArray.map((project) => {
            return (
              <Grid xs={12} sm={12} md={6} lg={4}>
                <img src={project.coverImage} alt="blah" width={400} />

                <h2>{project.name} </h2>
                <p>{project.summary}</p>
                <p>To be created by: {project.userName}</p>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
