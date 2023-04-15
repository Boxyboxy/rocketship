import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { useRouter } from "next/router";
import axios from "axios";

// Will update margin/ spacing / design

export default function ProjectPage() {
  const router = useRouter();

  const [stats, setStats] = useState([
    { statName: "Contributers", sum: "9877" },
    { statName: "Funded", sum: "$124,600" },
  ]);

  const [specificProject, setSpecificProject] = useState();
  const [creatorId, setCreatorId] = useState();
  const [projectId, setProjectId] = useState();
  const [skills, setSkills] = useState([]);

  function handleEquityPurchaseClick() {
    router.push({
      pathname: `/projects/${projectId}/${creatorId}/checkout`,
      query: { type: "equity" },
    });
  }

  function handleMembershipPurchaseClick() {
    router.push({
      pathname: `/projects/${projectId}/${creatorId}/checkout`,
      query: { type: "membership" },
    });
  }

  useEffect(() => {
    if (router.query.creatorId) {
      setCreatorId(router.query.creatorId);
    }
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
  }, [router.query.creatorId, router.query.projectId]);

  useEffect(() => {
    if (projectId && creatorId) {
      // will refactor all this
      const fetchProject = async () => {
        try {
          const [projectResponse, userResponse] = await Promise.all([
            axios.get(`http://localhost:8080/projects/${projectId}`),
            axios.get(`http://localhost:8080/users/${creatorId}`),
          ]);

          const [categoryResponse, skillsNeededResponse, allSkills] =
            await Promise.all([
              axios.get(
                `http://localhost:8080/categories/${projectResponse.data.categoryId}`
              ),
              axios.get(
                `http://localhost:8080/requiredSkills?projectId=${projectId}`
              ),
              // axios.get(`http://localhost:8080/skills`),
            ]);

          const skillArray = [];

          for (const skillNeeded of skillsNeededResponse.data) {
            await axios
              .get(`http://localhost:8080/skills/${skillNeeded.skillId}`)
              .then(function (response) {
                skillArray.push(response.data.skill);
              })
              .catch(function (error) {
                console.log(error);
              });
          }

          // for (const skillNeeded of skillsNeededResponse.data) {
          //   for (const skill of allSkills.data) {
          //     if (skillNeeded.skillId === skill.id) {
          //       skillArray.push(skill.skill);
          //       break;
          //     }
          //   }
          // }

          setSkills(skillArray);

          const editedProject = {
            ...projectResponse.data,
            creatorName: userResponse.data.name,
            categoryName: categoryResponse.data.name,
          };
          console.log(editedProject);
          setSpecificProject(editedProject);
        } catch (err) {
          console.log(err);
        }
      };
      fetchProject().then(console.log(specificProject));
    }
  }, [creatorId, projectId]);

  return (
    <div>
      {specificProject && (
        <div>
          <Head>
            <title>
              {specificProject.name} | {specificProject.creatorName}
            </title>
          </Head>
          <div>
            <NavBar />
            <Category />
          </div>
          <div>
            <ArrowBackIcon /> Back
            <Typography variant="h3"> {specificProject.name}</Typography>
            <Grid container sx={{ marginBottom: 1 }}>
              <LocationOnIcon />
              {specificProject.location}
              {/* need to finalise correct icon */}
              <CategoryIcon />
              {specificProject.categoryName}
            </Grid>
            <Grid container>
              <Grid xs={12} sm={12} md={7} lg={6}>
                <img src={specificProject.coverImage} width={500} />
              </Grid>
              <Grid xs={12} sm={12} md={5} lg={6}>
                <Typography variant="h6">About the project</Typography>

                <p>{specificProject.summary}</p>

                <Grid container sx={{ marginLeft: 0, marginRight: 20 }}>
                  {stats.map((stat, index) => {
                    return (
                      <Grid
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        sx={{ textAlign: "left" }}
                        key={index}
                      >
                        <Typography
                          sx={{ fontSize: "1.5rem", color: "#3E497A" }}
                        >
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
                    "&:hover": {
                      backgroundColor: "#21325E",
                    },
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
                    <p> {specificProject.creatorName}</p>
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
                  <p>{specificProject.details}</p>
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
                    {skills &&
                      skills.map((skill, index) => <p key={index}>{skill}</p>)}
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 3,
                        color: "black",
                        backgroundColor: "#F1D00A",
                        "&:hover": {
                          backgroundColor: "#F1D00A",
                        },
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
                    <b>Funding options</b>
                    <br /> <br />
                    <b>MEMBERSHIP</b> <br />
                    You get this and this and that benefits. Our membership
                    program offers you exclusive benefits and discounts on our
                    products and services. As a member, you will have access to
                    a range of perks such as early access to new products,
                    exclusive discounts, and special promotions. You will also
                    receive personalized support from our team to help you make
                    the most of your membership.
                    <br></br>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 3,
                        marginBottom: 3,
                        color: "white",
                        backgroundColor: "#3E497A",
                        width: "100%",
                        "&:hover": {
                          backgroundColor: "#3E497A",
                        },
                      }}
                      onClick={handleMembershipPurchaseClick}
                    >
                      Select
                    </Button>
                    <br></br>
                    <b> EQUITY </b>
                    <br></br>
                    Our investment plan offers you the opportunity to invest in
                    our company and benefit from its growth potential. As an
                    equity investor, you will become a part-owner of our company
                    and share in its profits and losses. Here are some of the
                    benefits of investing in our equity:
                    <br></br>
                    <ul>
                      Potential for high returns on your investment Opportunity
                      to share in the profits and losses of the company{" "}
                    </ul>
                    <ul>
                      Ability to participate in the company's decision-making
                      process
                    </ul>
                    <ul>
                      Chance to support a growing company and help it achieve
                      its goals
                    </ul>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 5,
                        color: "white",
                        backgroundColor: "#3E497A",
                        width: "100%",
                        "&:hover": {
                          backgroundColor: "#3E497A",
                        },
                      }}
                      onClick={handleEquityPurchaseClick}
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
      )}
    </div>
  );
}
