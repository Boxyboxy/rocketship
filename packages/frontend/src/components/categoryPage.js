import { useEffect, useState } from 'react';
import axios from 'axios';
import { categorydata } from '../constants/categorydata';
import styles from '../styles/categorypage.module.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BACKEND_URL } from '../constants/categorydata';
import Link from 'next/link';

const categoryMapping = {
  fintech: 'Fintech',
  healthtech: 'Healthtech',
  socialmedia: 'Social Media',
  games: 'Games',
  agritech: 'AgriTech',
  edutech: 'Edutech',
  ecommerce: 'Ecommerce',
  fnb: 'FnB'
};

export default function CategoryPage({ selectedCategory }) {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [randomProject, setRandomProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        const mappedCategoryName = categoryMapping[selectedCategory.name] || selectedCategory.name;
        const response = await axios.get(
          // `${BACKEND_URL}projects?categoryName=${mappedCategoryName}`
          `http://localhost:8080/projects?categoryName=${mappedCategoryName}`
        );
        setFeaturedProjects(Object.values(response.data));
        // Generate a random index within the range of the projects array
        const randomIndex = Math.floor(Math.random() * response.data.length);
        // Use the random index to select a random project
        setRandomProject(response.data[randomIndex]);

        // Remove selected random project from list of projects
        const filteredProjects = featuredProjects.filter(
          (project) => project.id !== randomProject.id
        );
        setFilteredProjects(filteredProjects);
        console.log(randomProject);
        console.log(featuredProjects);
        console.log(filteredProjects);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeaturedProject();
  }, [selectedCategory.name]);

  const category = categorydata[selectedCategory.name];

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
              <p className={styles.featuredTxt}>Created by: {randomProject.userId}</p>
            </div>
          </div>
        </div>
      )}

      {/* more related projects */}
      <div></div>
      {featuredProjects && (
        <div className={styles.title}>
          <span className={styles.line}></span>
          <div className={styles.headerTitle}>DISCOVER MORE</div>
          <div className={styles.cardsContainer}>
            {filteredProjects.map((result) => (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
