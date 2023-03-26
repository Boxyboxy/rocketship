import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import { Typography } from "@mui/material";

export default function HomePage() {
  // const [numOfProjects, setNumOfProjects] = useState(1238);
  // const [numOfContributers, setNumOfContributers] = useState("8723");
  // const [fundSum, setFundSum] = useState("123,000");
  const [stats, setStats] = useState([
    { statName: "Projects", sum: "3456" },
    { statName: "Contributers", sum: "9877" },
    { statName: "Funded", sum: "$124,600" },
  ]);

  //dk if we should use a math random to generate a featured project.

  const [projectsArray, setProjectsArray] = useState([
    {
      projectName: "Super cool App",
      summary:
        "About the project. We will talk more about this project here. This is supposed to be a brief summary that explains the project; however users will have to click in to see the finer details.",
      name: "Test Bots",
      coverImage:
        "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDd8fHRlY2h8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=1400&q=60",
    },
    {
      projectName: "Nice App",
      summary:
        "About the project. We will talk more about this project here. This is supposed to be a brief summary that explains the project; however users will have to click in to see the finer details.",
      name: "Good Projects Only",
      coverImage:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dGVjaHxlbnwwfDB8MHx8&auto=format&fit=crop&w=1200&q=60",
    },
    {
      projectName: "Great software hello",
      summary:
        "About the project. We will talk more about this project here. This is supposed to be a brief summary that explains the project; however users will have to click in to see the finer details.",
      name: "Fantastic Projects yea",
      coverImage:
        "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDd8fHRlY2h8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=1400&q=60",
    },
  ]);

  return (
    <div>
      <Head>
        <title>Discover Projects</title>
      </Head>
      <div>
        <p> This will be the navbar portion.</p>
      </div>
      <body>
        <h3> Featured </h3>
        <Grid container spacing={2}>
          <Grid xs={12} sm={12} md={7} lg={6}>
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1420&q=80"
              width={500}
            />
          </Grid>
          <Grid xs={12} sm={12} md={5} lg={6}>
            <h2>PROJECT NAME</h2>
            <p>
              About the project. We will talk more about this project here. This
              is supposed to be a brief summary that explains the project;
              however users will have to click in to see the finer details.
            </p>
            <p> To be created by: Creator name</p>
          </Grid>
        </Grid>
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

                <h2>{project.projectName} </h2>
                <p>{project.summary}</p>
                <p>Owner: {project.name}</p>
              </Grid>
            );
          })}
        </Grid>
      </body>
    </div>
  );
}
