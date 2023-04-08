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

export default function CategoryPage({ selectedCategory }) {
  const [featuredProject, setFeaturedProject] = useState(null);

  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/projects?categoryName=${selectedCategory.name}`
        );
        setFeaturedProject(response.data[selectedCategory.id]);
        // console.log(response.data[selectedCategory.name]);
        // console.log(selectedCategory.categoryId);
        console.log(selectedCategory.name);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeaturedProject();
  }, [selectedCategory.id]);

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

      {/* featured project */}
      {featuredProject && (
        <div className={styles.title}>
          <div className={styles.headerTitle}>FEATURED</div>
          <div className={styles.featuredContainer}>
            <img className={styles.featuredImg} src={featuredProject.coverImage} alt="fintech" />

            <div className={styles.txtContainer}>
              <div className={styles.featuredHeader}>{featuredProject.name}</div>
              <p className={styles.featuredTxt}>{featuredProject.details}</p>
              <p className={styles.featuredTxt}>Created by: {featuredProject.userId}</p>
            </div>
          </div>

          {/* more related projects */}
          <span className={styles.line}></span>
          <div className={styles.headerTitle}>DISCOVER MORE</div>
        </div>
      )}

      <div className={styles.cardsContainer}>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia component="img" height="140" image="/images/planet-01.png" alt="project1" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {category.project1}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A personal finance app that helps users manage their budget, track their expenses, and
              save money.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Creator Name</Button>
            <Typography size="small">$2,456 funded</Typography>
          </CardActions>
        </Card>

        <Card sx={{ maxWidth: 345 }}>
          <CardMedia component="img" height="140" image="/images/planet-02.png" alt="project1" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {category.project2}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A payment processing solution that allows businesses to accept payments via mobile
              devices, online, or in-person.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Creator Name</Button>
            <Typography size="small">$1,230 funded</Typography>
          </CardActions>
        </Card>

        <Card sx={{ maxWidth: 345 }}>
          <CardMedia component="img" height="140" image="/images/planet-03.png" alt="project1" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {category.project3}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              An investment platform that offers personalized investment recommendations based on
              users' financial goals and risk tolerance.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Creator Name</Button>
            <Typography size="small">$512 funded</Typography>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
