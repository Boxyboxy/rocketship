import NavBar from '../../components/navbar';
import Category from '../../components/category';
import Footer from '../../components/footer';
import styles from '../../styles/categorypage.module.css';
import { categorydata } from '../../constants/categorydata';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export async function getServerSideProps(context) {
  const { categoryname } = context.query;
  // Get the list of possible categories
  const categories = ['fintech', 'healthtech', 'fnb', 'socialmedia', 'games', 'agritech'];
  // Get the content for the specified category
  const content = categorydata[categoryname];
  // Check if the requested category is valid
  if (!categories.includes(categoryname)) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      // categoryname,
      content
    }
  };
}

export default function CategoryPage({ categoryname, content }) {
  return (
    <div>
      <NavBar />
      <Category />
      {/* intro to category */}
      <h1 className={styles.header}>{content.title}</h1>
      <div className={styles.container}>
        <p className={styles.description}>{content.description}</p>
        <p className={styles.shoutout}>{content.shoutout}</p>
        <span className={styles.line}></span>
      </div>

      {/* featured project */}
      <div className={styles.title}>
        <div className={styles.headerTitle}>FEATURED</div>
        <div className={styles.featuredContainer}>
          <img className={styles.featuredImg} src={content.featuredImg} alt="fintech" />
          <div className={styles.txtContainer}>
            <div className={styles.featuredHeader}>{content.featured}</div>
            <p className={styles.featuredTxt}>{content.featuredTxt}</p>
            <p className={styles.featuredTxt}>Created by: _________</p>
          </div>
        </div>

        {/* more related projects */}
        <span className={styles.line}></span>
        <div className={styles.headerTitle}>DISCOVER MORE</div>
      </div>
      <div className={styles.cardsContainer}>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia component="img" height="140" image="/images/planet-01.png" alt="project1" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {content.project1}
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
              {content.project2}
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
              {content.project3}
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
      <Footer />
    </div>
  );
}
