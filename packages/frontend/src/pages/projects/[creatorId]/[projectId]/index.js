import Head from 'next/head';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { Typography, Button, Box, TextField, Chip, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavBar from '../../../../components/navbar';
import Category from '../../../../components/category';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useUser } from '@auth0/nextjs-auth0/client';
import { BACKEND_URL } from '../../../../constants/backendUrl';
import Footer from '../../../../components/footer';
import styles from '../../../../styles/projectpage.module.css';
import Link from 'next/link';

import axios from 'axios';

// PENDING: Will refactor into separate components
// PENDING: Will update margin/ spacing / design

export default function ProjectPage() {
  const router = useRouter();

  const [stats, setStats] = useState([]);

  const [specificProject, setSpecificProject] = useState();
  const [creatorId, setCreatorId] = useState();
  const [projectId, setProjectId] = useState();
  const [skills, setSkills] = useState([]);
  const [formValues, setFormValues] = useState({});

  const { user, isLoading, error, getAccessTokenSilently, isAuthenticated } = useUser();
  const [userId, setUserId] = useState();
  const [userSkills, setUserSkills] = useState([]);
  const [code, setCode] = useState('');
  const [pitchSlides, setPitchSlides] = useState([]);

  //mapping for Chip color display
  const categoryColorMap = {
    Fintech: 'primary',
    Healthtech: 'secondary',
    'Social Media': 'error',
    Games: 'info',
    Agritech: 'success',
    Edutech: 'warning',
    Ecommerce: 'secondary',
    FnB: 'default'

    // Add more mappings as needed
  };

  // modal form
  const [openContributeForm, setOpenContributeForm] = useState(false);

  function handleOpenContributeForm() {
    setOpenContributeForm(true);
  }

  function handleCloseContributeForm() {
    setOpenContributeForm(false);
  }

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
      projectId: projectId,
      status: 'pending'
    });
    console.log(formValues);
  };

  function handleSendContributeRequest(e) {
    e.preventDefault();
    axios
      .post(`http://localhost:8080/contributions`, formValues)
      .then(function (response) {
        console.log(response);
        // openSuccessNotification("top");
      })
      .catch(function (error) {
        console.log(error);
        // openFailureNotification("top");
      });
  }

  function handleEquityPurchaseClick() {
    router.push({
      pathname: `/projects/${projectId}/${creatorId}/checkout`,
      query: { type: 'equity' }
    });
  }

  function handleMembershipPurchaseClick() {
    router.push({
      pathname: `/projects/${projectId}/${creatorId}/checkout`,
      query: { type: 'membership' }
    });
  }

  useEffect(() => {
    if (router.query.creatorId) {
      setCreatorId(router.query.creatorId);
    }
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
  }, [router.query.creatorId, router.query.projectId]);

  useEffect(() => {
    if (projectId && creatorId) {
      // will refactor all this
      const fetchProject = async () => {
        try {
          const [projectResponse, userResponse, fundingSumResponse, backerSumResponse] =
            await Promise.all([
              axios.get(`http://localhost:8080/projects/${projectId}`),
              axios.get(`http://localhost:8080/users/${creatorId}`),
              axios.get(`http://localhost:8080/fundings/sum/${projectId}`),
              axios.get(`http://localhost:8080/fundings/backerSum?projectId=${projectId}`)
            ]);
          console.log(backerSumResponse.data);
          let formattedSum;
          //format funding sum response
          if (fundingSumResponse.data > 10000) {
            formattedSum = Intl.NumberFormat({
              style: 'currency',
              currency: 'SGD'
            }).format(fundingSumResponse.data);
          } else {
            formattedSum = fundingSumResponse.data;
          }

          setStats([
            {
              statName: 'Backers',
              sum: `${backerSumResponse.data.uniqueBackers}`
            },
            { statName: 'Funded', sum: `$${formattedSum}` }
          ]);

          const [categoryResponse, skillsNeededResponse, allSkills] = await Promise.all([
            axios.get(`http://localhost:8080/categories/${projectResponse.data.categoryId}`),
            axios.get(`http://localhost:8080/requiredSkills?projectId=${projectId}`)
            // axios.get(`http://localhost:8080/skills`),
          ]);

          const skillArray = [];

          for (const skillNeeded of skillsNeededResponse.data) {
            await axios
              .get(`http://localhost:8080/skills/${skillNeeded.skillId}`)
              .then(function (response) {
                console.log(response);
                // skillArray.push({
                //   ...skillArray,
                //   [skillNeeded.skillId]: response.data.skill,
                // });
                skillArray.push(...skills, {
                  skillId: skillNeeded.skillId,
                  skill: response.data.skill
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          }

          // for (const skillNeeded of skillsNeededResponse.data) {
          //   for (const skill of allSkills.data) {
          //     if (skillNeeded.skillId === skill.id) {
          //       skillArray.push(skill.skill);
          //       break;
          //     }
          //   }
          // }

          setSkills(skillArray);
          console.log(skillArray);

          const editedProject = {
            ...projectResponse.data,
            creatorName: userResponse.data.name,
            categoryName: categoryResponse.data.name
          };

          setSpecificProject(editedProject);
        } catch (err) {
          console.log(err);
        }
      };
      fetchProject().then(console.log(specificProject));
    }
  }, [creatorId, projectId]);
  console.log(specificProject);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users?email=${user.email}`);
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);
  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users/${userId}`);
        setUserSkills(
          response.data.skills.filter(
            (userSkill) =>
              skills.findIndex((skill) => {
                return skill.skill == userSkill.skill;
              }) >= 0
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    if (userId && skills.length > 0) fetchUserSkills();
  }, [userId, skills]);

  // useEffect(() => {
  //   if (specificProject.pitchSlides) {
  //     // added null check
  //     const pitchSlidesArray = specificProject.pitchSlides.map((slide) => slide.urlString);
  //     setPitchSlides(pitchSlidesArray);
  //   }
  // }, [specificProject]);
  // useEffect(() => {
  //   async function fetchCode() {
  //     const response = await fetch(
  //       'https://api.github.com/Boxyboxy/rocketship/blob/main/packages/frontend/src/components/category.js'
  //     );
  //     const data = await response.json();
  //     // const decodedCode = atob(data.content);
  //     // setCode(decodedCode);
  //     console.log(response)
  //   }

  //   fetchCode();
  // }, []);

  return (
    <div>
      {specificProject && (
        <div>
          <Head>
            <title>
              {specificProject.name} | {specificProject.creatorName}
            </title>
          </Head>
          <div>
            <NavBar />
            <Category />
          </div>
          <div className={styles.container}>
            {/* <ArrowBackIcon /> Back */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="h3"
                sx={{ marginTop: '15px', marginBottom: '15px', fontFamily: 'Montserrat' }}>
                {specificProject.name}
              </Typography>
              <Typography sx={{ justifyContent: 'center', fontFamily: 'Montserrat' }}>
                <LocationOnIcon />
                {specificProject.location}
              </Typography>

              <Chip
                sx={{ justifyContent: 'center', fontFamily: 'Montserrat' }}
                label={specificProject.categoryName}
                color={categoryColorMap[specificProject.categoryName] || 'default'}
              />

              {/* <Grid container sx={{ marginBottom: 1 }}> */}

              {/* need to finalise correct icon */}
              {/* <CategoryIcon /> */}

              {/* </Grid> */}
            </Stack>
            <Grid container>
              <Grid xs={12} sm={12} md={7} lg={6}>
                <img src={specificProject.coverImage} width={600} height={400} />
              </Grid>
              <Grid xs={12} sm={12} md={5} lg={6}>
                {/* <Typography variant="h6">About the project</Typography> */}
                <h2>About the project</h2>

                <p>{specificProject.summary}</p>

                <Grid container sx={{ marginLeft: 0, marginRight: 10 }}>
                  {stats &&
                    stats.map((stat, index) => {
                      return (
                        <Grid xs={6} sm={6} md={6} lg={6} sx={{ textAlign: 'left' }} key={index}>
                          <Typography
                            sx={{ fontSize: '1.5rem', color: '#3E497A', fontFamily: 'Montserrat' }}>
                            {stat.sum}
                          </Typography>
                          <Typography
                            sx={{ fontSize: '0.8rem', color: '#3E497A', fontFamily: 'Montserrat' }}>
                            {stat.statName}
                          </Typography>
                        </Grid>
                      );
                    })}
                  <Grid xs={6} sm={6} md={6} lg={6} sx={{ textAlign: 'left' }}>
                    <Typography
                      sx={{ fontSize: '1.5rem', color: '#3E497A', fontFamily: 'Montserrat' }}>
                      ${specificProject.fundingGoal}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.8rem', color: '#3E497A', fontFamily: 'Montserrat' }}>
                      Funding Goal
                    </Typography>
                  </Grid>
                </Grid>
                <a href="#fund-membership">
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: 3,
                      color: 'white',
                      backgroundColor: '#21325E',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: '#21325E'
                      }
                    }}>
                    Fund
                  </Button>
                </a>
                <h3>Project Owner</h3>
                <Grid container>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar />
                    <Link className={styles.name} href={`/profile/${specificProject.userId}`}>
                      {specificProject.creatorName}
                    </Link>
                  </Stack>
                  <Button
                    variant="contained"
                    sx={{
                      marginLeft: 'auto',
                      color: 'black',
                      backgroundColor: '#F1D00A',
                      width: 100,
                      height: 30
                    }}>
                    Chat
                  </Button>
                  {/* </Grid> */}
                </Grid>
              </Grid>

              <Grid container sx={{ marginTop: 2 }}>
                <Grid xs={12} sm={12} md={7} lg={7}>
                  <h2>Project Details</h2>
                  <p className={styles.details}>{specificProject.details}</p>
                  <>{specificProject.githubRepoUrl}</>
                </Grid>

                <Grid xs={12} sm={12} md={5} lg={5}>
                  <h3>SKILLS NEEDED</h3>
                  {/* <br /> */}
                  <Box
                    sx={{
                      width: '100%',
                      minHeight: 100,
                      border: '2px solid grey'
                      // border: '1px dashed grey'
                    }}>
                    {skills &&
                      skills.map((skill) => (
                        <p className={styles.skills} key={skill.skillId}>
                          {skill.skill}
                        </p>
                      ))}
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 3,
                        color: 'black',
                        backgroundColor: '#F1D00A',
                        '&:hover': {
                          backgroundColor: '#F1D00A'
                        },
                        width: '100%'
                      }}
                      onClick={handleOpenContributeForm}
                      disabled={userSkills.length < 1}>
                      {userSkills.length < 1
                        ? 'You do not have the relevant skills to contribute'
                        : 'Contribute'}
                    </Button>
                    <Dialog open={openContributeForm} onClose={handleCloseContributeForm}>
                      <DialogTitle>Want to contribute to this project?</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Select the skill for contribution to the project.
                        </DialogContentText>
                        {/* Need to update this to match user skills, can only add in when user Id is available */}
                        <Select
                          id="Skill"
                          label="Skill"
                          fullWidth
                          sx={{ marginTop: 2, marginBottom: 2 }}
                          name="userSkillId"
                          onChange={handleInputChange}>
                          {/* The value is set to userSkill so you can submit this value in your post request */}
                          {userSkills.map((userSkill) => (
                            <MenuItem key={userSkill.id} value={userSkill.userSkill.id}>
                              {userSkill.skill}
                            </MenuItem>
                          ))}
                        </Select>

                        <DialogContentText>
                          Please kindly write in a message to the project owner here.
                        </DialogContentText>
                        <TextField
                          multiline
                          fullWidth
                          margin="dense"
                          rows={4}
                          name="message"
                          onChange={handleInputChange}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleCloseContributeForm}
                          sx={{
                            color: '#21325E',
                            '&:hover': {
                              backgroundColor: 'white'
                            }
                          }}>
                          Cancel
                        </Button>
                        <Button
                          onClick={(handleCloseContributeForm, handleSendContributeRequest)}
                          sx={{
                            variant: 'primary',
                            color: 'white',
                            backgroundColor: '#21325E',
                            '&:hover': {
                              backgroundColor: '#21325E'
                            }
                          }}>
                          Send Request
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                  <h3>FUNDING OPTIONS</h3>
                  <Box
                    sx={{
                      width: '100%',
                      minHeight: 100,
                      border: '2px solid grey'
                    }}>
                    {/* <b id="fund-membership">Funding options</b>
                    <br /> <br /> */}
                    <div className={styles.box}>
                      <h3 id="fund-membership">MEMBERSHIP</h3>
                      <p>
                        You get this and this and that benefits. Our membership program offers you
                        exclusive benefits and discounts on our products and services. As a member,
                        you will have access to a range of perks such as early access to new
                        products, exclusive discounts, and special promotions. You will also receive
                        personalized support from our team to help you make the most of your
                        membership.
                      </p>
                    </div>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 3,
                        marginBottom: 3,
                        color: 'white',
                        backgroundColor: '#3E497A',
                        width: '100%',
                        '&:hover': {
                          backgroundColor: '#3E497A'
                        }
                      }}
                      onClick={handleMembershipPurchaseClick}>
                      Select
                    </Button>
                    <div className={styles.box}>
                      <h3> EQUITY </h3>
                      <p>
                        {' '}
                        Our investment plan offers you the opportunity to invest in our company and
                        benefit from its growth potential. As an equity investor, you will become a
                        part-owner of our company and share in its profits and losses. Here are some
                        of the benefits of investing in our equity:
                      </p>

                      <ul>
                        <li>
                          Potential for high returns on your investment Opportunity to share in the
                          profits and losses of the company
                        </li>
                        <li>Ability to participate in the company's decision-making process</li>
                        <li>Chance to support a growing company and help it achieve its goals</li>
                      </ul>
                    </div>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 5,
                        color: 'white',
                        backgroundColor: '#3E497A',
                        width: '100%',
                        '&:hover': {
                          backgroundColor: '#3E497A'
                        }
                      }}
                      onClick={handleEquityPurchaseClick}>
                      Select
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            {/* this is extra features -- only backers can add comments */}
            Comment Section
            <p>blah blah</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
