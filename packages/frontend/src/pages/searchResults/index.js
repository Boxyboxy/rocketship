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
import Chip from '@mui/material/Chip';
import Link from 'next/link';
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

  // Fetch data using the search query value and update searchResults state
  useEffect(() => {
    axios
      .get(`http://localhost:8080/projects`, {
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
              const response = await axios.get(`http://localhost:8080/fundings/sum/${project.id}`);
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
    fetch('http://localhost:8080/projects')
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
      <NavBar />
      <Category />
      {searchResults.length ? (
        <h1 className={styles.header}>Search Results for "{inputValue}"</h1>
      ) : (
        <h1 className={styles.header}>No search results for "{inputValue}"</h1>
      )}
      
      {searchResults.length ? (
        <div className={styles.searchContainer}>
        <ProjectCardsContainer projects={projectsToDisplay} /></div>
        
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
            {topProjects.map((result) => (
              // <div className={styles.searchResultsContainer}>
              <Grid item xs={12} sm={6} md={3} key={result.id}>
                <Link
                  className={styles.linkName}
                  href={`/projects/${result.userId}/${result.id}`}
                  passHref>
                  <Card
                    className={styles.card}
                    sx={{
                      maxWidth: 345,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}>
                    <CardMedia sx={{ height: 140 }} image={result.coverImage} title={result.name} />
                    <CardContent sx={{ height: 120, overflow: 'hidden' }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {result.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.summary}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Link className={styles.linkName} href={`/profile/${result.userId}`} passHref>
                        <Button size="small">{result.userName}</Button>
                      </Link>
                    </CardActions>
                  </Card>{' '}
                </Link>
              </Grid>
              // </div>
            ))}
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
