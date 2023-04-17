import Head from "next/head";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import NavBar from "../../components/navbar";
import Category from "../../components/category";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box } from "@mui/material";
import Link from "next/link";
import Footer from "../../components/footer";
import styles from "../../styles/projects.module.css";

export default function HomePage() {
  // const [numOfProjects, setNumOfProjects] = useState(1238);
  // const [numOfContributers, setNumOfContributers] = useState("8723");
  // const [fundSum, setFundSum] = useState("123,000");
  const [projectsArray, setProjectsArray] = useState([]);
  const [featuredProject, setFeaturedProject] = useState();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const [dateSortOption, setDateSortOption] = useState("asc");
  const [fundingSortOption, setFundingSortOption] = useState("asc");
  const [projectsFunding, setProjectsFunding] = useState([]);
  const [sortedProjects, setSortedProjects] = useState([]);
  const [filteredProjectswFunding, setFilteredProjectswFunding] = useState([]);

  const [stats, setStats] = useState([
    { statName: "Projects", sum: "3456" },
    { statName: "Contributors", sum: "9877" },
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
        const formattedData = projects.map((item) => ({
          ...item,
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));
        setProjectsArray(formattedData);
        console.log(projectsArray);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjects();
  }, []);

  //math random to generate a featured project
  useEffect(() => {
    // adding 0.1 to avoid the chance that we get a zero
    // const featuredProjectId = Math.round((Math.random() + 0.1) * projectsArray.length);
    // console.log(featuredProjectId);
    const randomIndex = Math.floor(Math.random() * projectsArray.length);
    // const featured = projectsArray[featuredProjectId];
    setFeaturedProject(projectsArray[randomIndex]);
  }, [projectsArray]);

  //to remove featured project from projectsArray
  useEffect(() => {
    if (featuredProject) {
      const filteredProjects = projectsArray.filter(
        (project) => project.name !== featuredProject.name
      );
      setFilteredProjects(filteredProjects);
      // console.log(filteredProjects);
    }
  }, [projectsArray, featuredProject]);

  //get funding
  useEffect(() => {
    const fetchFunding = async () => {
      console.log(filteredProjects);
      if (projectsArray) {
        for (const project of filteredProjects) {
          try {
            const fundingPromises = filteredProjects.map(async (project) => {
              const response = await axios.get(
                `http://localhost:8080/fundings/sum/${project.id}`
              );
              return { ...project, funding: response.data };
            });

            const fetchedFundings = await Promise.all(fundingPromises);
            setProjectsFunding(fetchedFundings);
            console.log(projectsFunding);
          } catch (err) {
            console.log(err);
          }
        }
      }
    };

    fetchFunding();
  }, [filteredProjects]);

  //logic to check if funding is hit
  useEffect(() => {
    // add in a new column - fundingHit inside filteredProjects array
    const filteredProjectswFunding = projectsFunding.map((project) => {
      return {
        ...project,
        fundingHit: project.funding >= project.fundingGoal,
      };
    });

    setFilteredProjectswFunding(filteredProjectswFunding);
    console.log(filteredProjectswFunding);
  }, [projectsFunding]);

  const handleSort = (button) => {
    if (button === "date") {
      setDateSortOption(dateSortOption === "asc" ? "desc" : "asc");
    } else if (button === "funding") {
      setFundingSortOption(fundingSortOption === "asc" ? "desc" : "asc");
    }
  };

  //sorting logic
  useEffect(() => {
    const sortedArray = [...filteredProjectswFunding];
    sortedArray.sort((a, b) => {
      if (dateSortOption === "desc" && fundingSortOption === "desc") {
        if (new Date(b.date) < new Date(a.date)) {
          return -1;
        } else if (new Date(b.date) > new Date(a.date)) {
          return 1;
        } else {
          return b.funding - a.funding; // if dates are equal, sort by funding descending
        }
      } else if (dateSortOption === "desc") {
        return new Date(b.date) - new Date(a.date); // sort by date descending
      } else if (fundingSortOption === "desc") {
        return b.funding - a.funding; // sort by funding descending
      } else {
        return 0; // no sorting applied
      }
    });
    setSortedProjects(sortedArray);
  }, [dateSortOption, fundingSortOption, filteredProjectswFunding]);

  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const projectsToDisplay = sortedProjects.slice(startIndex, endIndex);

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
        <div className={styles.headerTitle}>FEATURED</div>
        {featuredProject && (
          <div className={styles.title}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={12} md={7} lg={6}>
                <Link
                  href={`/projects/${featuredProject.userId}/${featuredProject.id}`}
                >
                  <img
                    className={styles.featuredImg}
                    src={featuredProject.coverImage}
                    // width={500}
                    height={400}
                  />
                </Link>
              </Grid>
              <Grid xs={12} sm={12} md={5} lg={6}>
                <div>
                  <Link
                    className={styles.linkName}
                    href={`/projects/${featuredProject.userId}/${featuredProject.id}`}
                  >
                    <h2 className={styles.featuredHeader}>
                      {featuredProject.name}
                    </h2>
                  </Link>
                  <p className={styles.featuredTxt}>
                    {featuredProject.details}
                  </p>
                  <Link
                    className={styles.name}
                    href={`/profile/${featuredProject.userId}`}
                  >
                    {featuredProject.userName}
                  </Link>
                </div>
              </Grid>
            </Grid>
          </div>
        )}
        <div className={styles.container}>
          <span className={styles.line}></span>
          <Grid container spacing={1} sx={{ margin: "10%" }}>
            {stats.map((stat) => {
              return (
                <Grid
                  key={stat.id}
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  sx={{ textAlign: "center" }}
                >
                  <Typography sx={{ fontSize: "3rem", color: "#3E497A" }}>
                    {stat.sum}
                  </Typography>
                  <Typography sx={{ fontSize: 20 }}>{stat.statName}</Typography>
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div className={styles.container}>
          <span className={styles.line}></span>
        </div>
        <h1 className={styles.headerTitle}>TRENDING PROJECTS</h1>
        <Box className={styles.sortContainer}>
          <Button className={styles.sort} onClick={() => handleSort("date")}>
            Date
            {dateSortOption === "asc" ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )}
          </Button>

          <Button className={styles.sort} onClick={() => handleSort("funding")}>
            Funding
            {fundingSortOption === "asc" ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )}
          </Button>
        </Box>
        <div className={styles.title}>
          <Grid container spacing={2}>
            {projectsToDisplay.map((project) => {
              return (
                <Grid key={project.id} xs={12} sm={12} md={6} lg={4}>
                  <Link
                    className={styles.name}
                    href={`/projects/${project.id}`}
                  >
                    <Card
                      sx={{
                        maxWidth: 345,
                        height: 350,
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      <CardMedia
                        sx={{ height: 140 }}
                        image={project.coverImage}
                        title={project.name}
                      />
                      <CardContent>
                        <Stack direction="row" spacing={1}>
                          <Typography gutterBottom variant="h5" component="div">
                            {project.name}
                          </Typography>
                          {project.fundingHit && project.fundingGoal != null ? (
                            <Chip label="Fully funded!" color="success" />
                          ) : (
                            <></>
                          )}
                        </Stack>
                        <Typography variant="body2">
                          {project.summary}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button href={`/profile/${project.userId}`}>
                          {project.userName}
                        </Button>
                      </CardActions>
                    </Card>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </div>
        {projectsToDisplay.length >= 1 && (
          <Stack spacing={2} className={styles.pagination}>
            <Pagination
              count={totalPages}
              color="primary"
              page={currentPage}
              onChange={handlePageChange}
            />
          </Stack>
        )}
      </div>
      <Footer />
    </div>
  );
}
