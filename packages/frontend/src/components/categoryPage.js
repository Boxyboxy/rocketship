import { useEffect, useState } from 'react';
import axios from 'axios';
import { categorydata } from '../constants/categorydata';
import styles from '../styles/categorypage.module.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BACKEND_URL } from '../constants/categorydata';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';

const categoryMapping = {
  fintech: 'Fintech',
  healthtech: 'Healthtech',
  socialmedia: 'Social Media',
  games: 'Games',
  agritech: 'Agritech',
  edutech: 'Edutech',
  ecommerce: 'Ecommerce',
  fnb: 'FnB'
};

export default function CategoryPage({ selectedCategory }) {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [randomProject, setRandomProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  const [sortOption, setSortOption] = useState(null); // default sort option is 'date'
  const [sortedProjects, setSortedProjects] = useState(filteredProjects); // initial sorted projects array

  const [anchorEl, setAnchorEl] = useState(null);
  const [projectOwner, setProjectOwner] = useState({});

  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        const mappedCategoryName = categoryMapping[selectedCategory.name] || selectedCategory.name;
        const response = await axios.get(
          // `${BACKEND_URL}/projects?categoryName=${mappedCategoryName}`
          `http://localhost:8080/projects?categoryName=${mappedCategoryName}`
        );

        setFeaturedProjects(response.data);
        // Generate a random index within the range of the projects array
        const randomIndex = Math.floor(Math.random() * response.data.length);
        // Use the random index to select a random project
        setRandomProject(response.data[randomIndex]);

        console.log(randomProject);
        console.log(featuredProjects);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeaturedProject();
  }, [selectedCategory.name]);

  //to remove random project from projects array
  useEffect(() => {
    const filteredProjects = featuredProjects.filter(
      (project) => project.name !== randomProject.name
    );

    // Format the date in the desired format "DD-MMM-YY"
    const formattedData = filteredProjects.map((item) => ({
      ...item,
      date: new Date(item.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));

    setFilteredProjects(formattedData);
    console.log(formattedData);
  }, [featuredProjects, randomProject]);

  const category = categorydata[selectedCategory.name];

  //for sorting
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
    const sortedArray = [...filteredProjects];
    if (sortOption === 'date') {
      sortedArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by date
    } else if (sortOption === 'fundings') {
      sortedArray.sort((a, b) => a.fundings - b.fundings); // sort by fundings
    }
    setSortedProjects(sortedArray);
  }, [sortOption, filteredProjects]);

  //for pagination
  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const projectsToDisplay = sortedProjects.slice(startIndex, endIndex);

  //get creator name
  useEffect(() => {
    const fetchProjectOwner = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/${randomProject.userId}`);

        setProjectOwner(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjectOwner();
  }, [randomProject]);

  return (
    <div>
      {/* intro to category */}
      <h1 className={styles.header}>{category.title}</h1>
      <div className={styles.container}>
        <p className={styles.description}>{category.description}</p>
        <p className={styles.shoutout}>{category.shoutout}</p>
        <span className={styles.line}></span>
      </div>

      {/* random project */}
      {randomProject && (
        <div className={styles.title}>
          <div className={styles.headerTitle}>FEATURED</div>
          <div className={styles.featuredContainer}>
            <Link
              className={styles.linkName}
              href={`/projects/${randomProject.userId}/${randomProject.id}`}
              passHref>
              <img className={styles.featuredImg} src={randomProject.coverImage} alt="fintech" />
            </Link>

            <div className={styles.txtContainer}>
              <div className={styles.featuredHeader}>{randomProject.name}</div>
              <p className={styles.featuredTxt}>{randomProject.details}</p>
              <Link className={styles.name} href={`/profile/${randomProject.userId}`}>
                {projectOwner.name}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <span className={styles.line}></span>
      </div>
      {/* more related projects */}
      {filteredProjects.length >= 1 && (
        <div className={styles.title}>
          <div className={styles.headerTitle}>DISCOVER MORE</div>
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
          <div className={styles.cardsContainer}>
            {projectsToDisplay.map((result) => (
              <Card
                sx={{
                  maxWidth: 345,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
                key={result.id}>
                <CardMedia
                  component="img"
                  height="140"
                  width="100%"
                  image={result.coverImage}
                  alt={result.name}
                  sx={{ objectFit: 'cover', maxHeight: '140px' }}
                />
                <CardContent sx={{ height: 120, overflow: 'hidden' }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {result.name}
                  </Typography>
                  <Typography spacing={10} variant="body2" color="text.secondary">
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
                  <Typography spacing={1}>Launched on: {result.date}</Typography>
                </CardActions>
              </Card>
            ))}
          </div>
        </div>
      )}

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
  );
}
