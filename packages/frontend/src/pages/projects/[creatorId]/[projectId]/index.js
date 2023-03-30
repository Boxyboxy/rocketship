import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import { Typography, Button, Container, Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";

// bare bones is up, but margin/ spacing needs tweaking.

export default function ProjectPage() {
  const [stats, setStats] = useState([
    { statName: "Contributers", sum: "9877" },
    { statName: "Funded", sum: "$124,600" },
  ]);
  return (
    <div>
      <Head>
        <title>Project Name BY Creator Name</title>
      </Head>
      <div>
        <NavBar />
        <Category />
      </div>
      <br />
      <br />
      <br />
      <div>
        <ArrowBackIcon /> Back
        <Typography variant="h3">Project Title</Typography>
        <Grid container sx={{ marginBottom: 1 }}>
          <LocationOnIcon />
          Location here.
          {/* need to finalise correct icon */}
          <CategoryIcon />
          Category here.
        </Grid>
        <Grid container>
          <Grid xs={12} sm={12} md={7} lg={6}>
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1420&q=80"
              width={500}
            />
          </Grid>
          <Grid xs={12} sm={12} md={5} lg={6}>
            <Typography variant="h6">About the project</Typography>

            <p>
              We will talk more about this project here. This is supposed to be
              a brief summary that explains the project; however users will have
              to click in to see the finer details. This is the page with the
              finer details actually.
            </p>

            <Grid container sx={{ marginLeft: 0, marginRight: 20 }}>
              {stats.map((stat) => {
                return (
                  <Grid xs={6} sm={6} md={6} lg={6} sx={{ textAlign: "left" }}>
                    <Typography sx={{ fontSize: "1.5rem", color: "#3E497A" }}>
                      {stat.sum}
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      {stat.statName}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
            <Button
              variant="contained"
              sx={{
                marginTop: 3,
                color: "white",
                backgroundColor: "#21325E",
                width: "100%",
              }}
            >
              Fund
            </Button>
            <p>Project Owner</p>
            <Grid container>
              <Grid sx={{ marginRight: 1 }}>
                <Avatar />
              </Grid>
              <Grid>
                <p>creator profile name</p>
              </Grid>
              {/* <Grid xs={4} sm={4} md={4} lg={4}> */}
              <Button
                variant="contained"
                sx={{
                  marginLeft: "auto",
                  color: "black",
                  backgroundColor: "#F0F0F0",
                  width: 100,
                  height: 30,
                }}
              >
                Chat
              </Button>
              {/* </Grid> */}
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: 2 }}>
            <Grid xs={12} sm={12} md={7} lg={8}>
              <Typography variant="h5">Project Details</Typography>
              <p>
                Project details. And so for each two month semester, I would
                make a bullet point list of things I wanted to fix, or things I
                wanted to look at, or even questions I wanted to answer. And so
                for each two month semester, I would make a bullet point list of
                things I wanted to fix, or things I wanted to look at, or even
                questions I wanted to answer. And so for each two month
                semester, I would make a bullet point list of things I wanted to
                fix, or things I wanted to look at, or even questions I wanted
                to answer. And so for each two month semester, I would make a
                bullet point list of things I wanted to fix, or things I wanted
                to look at, or even questions I wanted to answer. And so for
                each two month semester, I would make a bullet point list of
                things I wanted to fix, or things I wanted to look at, or even
                questions I wanted to answer.
              </p>
            </Grid>
            <Grid xs={12} sm={12} md={5} lg={4}>
              <Box
                sx={{
                  width: "100%",
                  minHeight: 100,
                  border: "2px solid grey",
                }}
              >
                Skills Needed:
                <br />
                Product management<br></br>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: 3,
                    color: "black",
                    backgroundColor: "#F1D00A",
                    width: "100%",
                  }}
                >
                  Contribute
                </Button>
              </Box>

              <Box
                sx={{
                  marginTop: 5,
                  width: "100%",
                  minHeight: 100,
                  border: "2px solid grey",
                }}
              >
                Funding options
                <br />
                Option 1 blah blah blah
                <br></br>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: 3,
                    color: "black",
                    backgroundColor: "#F0F0F0",
                    width: "100%",
                  }}
                >
                  Select
                </Button>
                <br></br>
                Option 2 blah blah blah
                <br></br>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: 5,
                    color: "black",
                    backgroundColor: "#F0F0F0",
                    width: "100%",
                  }}
                >
                  Select
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* this is extra features -- only backers can add comments */}
        Comment Section
        <p>blah blah</p>
      </div>
    </div>
  );
}
