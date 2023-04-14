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

const SearchResults = () => {
  const router = useRouter();
  const { inputValue } = router.query;
  // console.log(inputValue);
  const [searchResults, setSearchResults] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

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
        console.log(response.data);
      });
  }, [inputValue]);

  useEffect(() => {
    fetch('http://localhost:8080/projects')
      .then((response) => response.json())
      .then((data) => {
        const top3Projects = sortedProjects.slice(0, 3);
        // Set the top 3 projects to the state
        setTopProjects(top3Projects);
        console.log(top3Projects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  const totalPages = Math.ceil(searchResults.length / projectsPerPage);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const projectsToDisplay = searchResults.slice(startIndex, endIndex);

  return (
    <div>
      <NavBar />
      <Category />
      <h1 className={styles.header}>Search Results for "{inputValue}"</h1>
      {searchResults.length ? (
        <Grid
          className={styles.searchContainer}
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start">
          {projectsToDisplay.map((result) => (
            <Grid item xs={12} sm={6} md={3} key={result.id}>
              <Card className={styles.card} sx={{ maxWidth: 345 }}>
                <CardMedia sx={{ height: 140 }} image={result.coverImage} title="green iguana" />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {result.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.summary}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link
                    className={styles.linkName}
                    href={`/projects/${result.userId}/${result.id}`}
                    passHref>
                    <Button size="small">View More</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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
              <Grid item xs={12} sm={6} md={3} key={result.id}>
                <Card className={styles.card} sx={{ maxWidth: 345 }}>
                  <CardMedia sx={{ height: 140 }} image={result.coverImage} title="green iguana" />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {result.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {result.summary}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link
                      className={styles.linkName}
                      href={`/projects/${result.userId}/${result.id}`}
                      passHref>
                      <Button size="small">View More</Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      {searchResults.length >= 1 && (
        <Stack spacing={2} className={styles.pagination}>
          <Pagination
            count={totalPages}
            color="primary"
            page={currentPage}
            onChange={handlePageChange}
          />
        </Stack>
      )}
      <Footer />
    </div>
  );
};
export default SearchResults;
