import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../../styles/search.module.css';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import config from '../../config';
import ProjectCardsContainer from '../../components/projectCardsContainer';

const SearchResults = () => {
  const router = useRouter();
  const { inputValue } = router.query;
  // console.log(inputValue);
  const [searchResults, setSearchResults] = useState([]);
  const [projectsArray, setProjectsArray] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;
  const [projectsFunding, setProjectsFunding] = useState([]);
  const [filteredProjectswFunding, setFilteredProjectswFunding] = useState([]);

  //fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/projects`),
          axios.get(`${config.apiUrl}/users`)
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

  // Fetch data using the search query value and update searchResults state
  useEffect(() => {
    axios
      .get(`${config.apiUrl}/projects`, {
        params: {
          projectName: inputValue
          // categoryName: inputValue
        }
      })
      .then((response) => {
        setSearchResults(response.data);
        // console.log(response);
      });
  }, [inputValue]);

  //get funding
  useEffect(() => {
    const fetchFunding = async () => {
      console.log(searchResults);
      if (searchResults) {
        for (const project of searchResults) {
          try {
            const fundingPromises = searchResults.map(async (project) => {
              const response = await axios.get(`${config.apiUrl}/fundings/sum/${project.id}`);
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
  }, [searchResults]);

  //logic to check if funding is hit
  useEffect(() => {
    // add in a new column - fundingHit inside filteredProjects array
    const filteredProjectswFunding = projectsFunding.map((project) => {
      return {
        ...project,
        fundingHit: project.funding >= project.fundingGoal
      };
    });

    setFilteredProjectswFunding(filteredProjectswFunding);
    console.log(filteredProjectswFunding);
  }, [projectsFunding]);

  // get top 3 projects
  useEffect(() => {
    fetch(`${config.apiUrl}/projects`)
      .then((response) => response.json())
      .then((data) => {
        const top3Projects = projectsArray.slice(0, 3);
        // Set the top 3 projects to the state
        setTopProjects(top3Projects);
        // console.log(top3Projects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, [projectsArray]);

  // for pagination
  const totalPages = Math.ceil(filteredProjectswFunding.length / projectsPerPage);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const projectsToDisplay = filteredProjectswFunding.slice(startIndex, endIndex);

  return (
    <div>
      <Head>
        <title>Search results for {inputValue}</title>
      </Head>
      <NavBar />
      <Category />
      {searchResults.length ? (
        <h1 className={styles.header}>Search Results for "{inputValue}"</h1>
      ) : (
        <h1 className={styles.header}>No search results for "{inputValue}"</h1>
      )}

      {searchResults.length ? (
        <div className={styles.searchContainer}>
          <ProjectCardsContainer projects={projectsToDisplay} />
        </div>
      ) : (
        <div className={styles.header}>
          <div className={styles.title}>We can't find what you are looking for ☹️ </div>
          <img className={styles.icon} src="/images/lostastronaut.png" alt="noresults" />
          <div className={styles.title2}>But you can continue exploring other rockets here:</div>
          <Grid
            className={styles.searchContainer}
            container
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start">
            <ProjectCardsContainer projects={topProjects} />
          </Grid>
        </div>
      )}
      {searchResults.length > projectsPerPage && (
        <Stack spacing={2} className={styles.pagination}>
          <Pagination
            count={totalPages}
            color="primary"
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginRight: '20px' }}
          />
        </Stack>
      )}
      <Footer />
    </div>
  );
};
export default SearchResults;
