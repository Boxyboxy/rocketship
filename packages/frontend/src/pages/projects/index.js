import Head from 'next/head';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SortIcon from '@mui/icons-material/Sort';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import styles from '../../styles/projects.module.css';

export default function HomePage() {
  // const [numOfProjects, setNumOfProjects] = useState(1238);
  // const [numOfContributers, setNumOfContributers] = useState("8723");
  // const [fundSum, setFundSum] = useState("123,000");
  const [projectsArray, setProjectsArray] = useState([]);
  const [featuredProject, setFeaturedProject] = useState();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const [sortOption, setSortOption] = useState(null);
  const [sortedProjects, setSortedProjects] = useState(projectsArray);

  const [anchorEl, setAnchorEl] = useState(null);

  const [stats, setStats] = useState([
    { statName: 'Projects', sum: '3456' },
    { statName: 'Contributers', sum: '9877' },
    { statName: 'Funded', sum: '$124,600' }
  ]);

  // fetching projects w/ the user names from userId field
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:8080/projects'),
          axios.get('http://localhost:8080/users')
        ]);
        const usersMap = new Map(usersResponse.data.map((user) => [user.id, user.name]));
        const projects = projectsResponse.data.map((project) => {
          return {
            ...project,
            userName: usersMap.get(project.userId)
          };
        });
        const formattedData = projects.map((item) => ({
          ...item,
          date: new Date(item.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
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
  console.log(featuredProject);

  useEffect(() => {
    console.log(featuredProject);
    console.log(projectsArray);
  }, [featuredProject, projectsArray]);

  // useEffect(() => {
  //   const filteredProjects = projectsArray.filter((project) => project.name !== featuredProject.id);

  //   setFilteredProjects(filteredProjects);
  // }, [projectsArray, featuredProject]);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (option) => {
    setSortOption(option);
    handleMenuClose();
  };

  useEffect(() => {
    const sortedArray = [...projectsArray];
    if (sortOption === 'date') {
      sortedArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by date
    } else if (sortOption === 'fundings') {
      sortedArray.sort((a, b) => a.fundings - b.fundings); // sort by fundings
    }
    setSortedProjects(sortedArray);
  }, [sortOption, projectsArray]);

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
        <Grid container spacing={1} sx={{ margin: '10%' }}>
          {stats.map((stat) => {
            return (
              <Grid key={stat.id} xs={12} sm={4} md={4} lg={4} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '3rem', color: '#3E497A' }}>{stat.sum}</Typography>
                <Typography sx={{ fontSize: 20 }}>{stat.statName}</Typography>
              </Grid>
            );
          })}
        </Grid>
        <h1>Trending Projects</h1>
        <Box>
          <IconButton onClick={handleMenuOpen} edge="end" color="inherit" aria-label="Sort">
            <SortIcon />
          </IconButton>
          <Menu
            anchor={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            // anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => handleSort('date')}>Sort by Date</MenuItem>
            <MenuItem onClick={() => handleSort('funding')}>Sort by Funding</MenuItem>
          </Menu>
        </Box>
        <Grid container spacing={2}>
          {projectsToDisplay.map((project) => {
            return (
              <Grid key={project.id} xs={12} sm={12} md={6} lg={4}>
                <img src={project.coverImage} alt="blah" width={400} />

                <h2>{project.name} </h2>
                <p>{project.summary}</p>
                <p>To be created by: {project.userName}</p>
              </Grid>
            );
          })}
        </Grid>

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
    </div>
  );
}
