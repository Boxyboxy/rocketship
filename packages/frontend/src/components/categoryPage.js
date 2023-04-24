import { useEffect, useState } from 'react';
import axios from 'axios';
import { categorydata } from '../constants/categorydata';
import styles from '../styles/categorypage.module.css';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import config from '../config';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box } from '@mui/material';
import Link from 'next/link';
import ProjectCardsContainer from '../components/projectCardsContainer';

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
  const projectsPerPage = 4;
  const [sortedProjects, setSortedProjects] = useState(filteredProjects); // initial sorted projects array
  const [projectsFunding, setProjectsFunding] = useState([]);
  const [dateSortOption, setDateSortOption] = useState('asc');
  const [fundingSortOption, setFundingSortOption] = useState('asc');
  const [projectOwner, setProjectOwner] = useState({});
  const [filteredProjectswFunding, setFilteredProjectswFunding] = useState([]);
  const [randomProjectwFunding, setRandomProjectwFunding] = useState(null);

  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        const mappedCategoryName = categoryMapping[selectedCategory.name] || selectedCategory.name;
        const response = await axios.get(
          `${config.apiUrl}/projects?categoryName=${mappedCategoryName}`
        );

        setFeaturedProjects(response.data);
        // Generate a random index within the range of the projects array
        const randomIndex = Math.floor(Math.random() * response.data.length);
        // Use the random index to select a random project
        setRandomProject(response.data[randomIndex]);
        console.log(randomProject);
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

    // Format the date in the desired format "DD-MMM-YYYY"
    const formattedData = filteredProjects.map((item) => ({
      ...item,
      date: new Date(item.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));

    setFilteredProjects(formattedData);
    // console.log(formattedData);
  }, [featuredProjects, randomProject]);

  const category = categorydata[selectedCategory.name];

  //get funding
  useEffect(() => {
    const fetchFunding = async () => {
      // console.log(filteredProjects);
      if (filteredProjects) {
        for (const project of filteredProjects) {
          try {
            const fundingPromises = filteredProjects.map(async (project) => {
              const response = await axios.get(`${config.apiUrl}/fundings/sum/${project.id}`);
              return { ...project, funding: response.data };
            });

            const fetchedFundings = await Promise.all(fundingPromises);
            setProjectsFunding(fetchedFundings);
            // console.log(projectsFunding);
          } catch (err) {
            console.log(err);
          }
        }
      }
    };

    fetchFunding();
  }, [filteredProjects]);

  //add funding to random project
  useEffect(() => {
    console.log('useEffect called');
    (async () => {
      if (randomProject) {
        try {
          const response = await axios.get(`${config.apiUrl}/fundings/sum/${randomProject.id}`);
          console.log('fetchRandomFunding called');
          const data = response.data;
          setRandomFunding((prevState) => ({ ...prevState, ...data }));
          console.log(randomProjectwFunding);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [randomProject]);

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
    // console.log(filteredProjectswFunding);
  }, [projectsFunding]);

  //for sorting
  const handleSort = (button) => {
    if (button === 'date') {
      setDateSortOption(dateSortOption === 'asc' ? 'desc' : 'asc');
    } else if (button === 'funding') {
      setFundingSortOption(fundingSortOption === 'asc' ? 'desc' : 'asc');
    }
  };

  //sorting logic
  useEffect(() => {
    const sortedArray = [...filteredProjectswFunding];
    sortedArray.sort((a, b) => {
      if (dateSortOption === 'desc' && fundingSortOption === 'desc') {
        if (new Date(b.date) < new Date(a.date)) {
          return -1;
        } else if (new Date(b.date) > new Date(a.date)) {
          return 1;
        } else {
          return b.funding - a.funding; // if dates are equal, sort by funding descending
        }
      } else if (dateSortOption === 'desc') {
        return new Date(b.date) - new Date(a.date); // sort by date descending
      } else if (fundingSortOption === 'desc') {
        return b.funding - a.funding; // sort by funding descending
      } else {
        return 0; // no sorting applied
      }
    });
    setSortedProjects(sortedArray);
  }, [dateSortOption, fundingSortOption, filteredProjectswFunding]);

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
        const response = await axios.get(`${config.apiUrl}/users/${randomProject.userId}`);

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
              <img
                // width={500}
                height={400}
                className={styles.featuredImg}
                src={randomProject.coverImage}
                alt={randomProject.name}
              />
            </Link>

            <div className={styles.txtContainer}>
              <Link className={styles.linkName} href={`/projects/${randomProject.id}`}>
                <div className={styles.featuredHeader}>{randomProject.name}</div>
              </Link>
              {/* {randomProjectwFunding.fundingGoal != null ? (
                <Chip label="Fully funded!" color="success" />
              ) : (
                <></>
              )} */}

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

          {filteredProjects.length > 1 && (
            <Box>
              <Button className={styles.sort} onClick={() => handleSort('date')}>
                Date
                {dateSortOption === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Button>

              <Button className={styles.sort} onClick={() => handleSort('funding')}>
                Funding
                {fundingSortOption === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Button>
            </Box>
          )}
          <div className={styles.cardsContainer}>
            {' '}
            <ProjectCardsContainer projects={projectsToDisplay} />
          </div>
        </div>
      )}

      {filteredProjects.length > projectsPerPage && (
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
