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
import Link from 'next/link';

const SearchResults = () => {
  const router = useRouter();
  const { inputValue } = router.query;
  console.log(inputValue);
  const [searchResults, setSearchResults] = useState([]);
  const [topProjects, setTopProjects] = useState([]);

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
    // Fetch all projects on component mount
    fetch('http://localhost:8080/projects')
      .then((response) => response.json())
      .then((data) => {
        // Sort the projects by some criteria (e.g. project popularity or rating)
        // and select the top 6 projects
        const sortedProjects = data.sort((a, b) => {
          // Modify the sorting criteria based on your requirements
          // For example, if you have a "popularity" field in your project object,
          // you can sort by it like this: return b.popularity - a.popularity;
        });
        const top3Projects = sortedProjects.slice(0, 3);
        // Set the top 6 projects to the state
        setTopProjects(top3Projects);
        console.log(top3Projects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);

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
          {searchResults.map((result) => (
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
          No results found, but you may be interested in the following projects:
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
      <Footer />
    </div>
  );
};
export default SearchResults;
