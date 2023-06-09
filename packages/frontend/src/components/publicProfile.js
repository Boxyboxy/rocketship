import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import styles from '../styles/profile.module.css';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import HandymanIcon from '@mui/icons-material/Handyman';
import ProjectCardsContainer from './projectCardsContainer';
import ContributorProjectCardsContainer from './contributorProjectCardsContainer';
import config from '../config';

export default function PublicProfile({ personalId }) {
  // Should this be a reusable component???? To be shared across public and personal
  const [profile, setProfile] = useState({
    name: 'John Doe',
    mobile: '81112222',
    email: 'johndoe@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/johndoe/',
    githubUrl: 'https://github.com/johndoe',
    skills: [
      { skill: 'UI/UX Design' },
      { skill: 'Web Development' },
      { skill: 'Digital Marketing' }
    ]
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/users/${personalId}`);

        setProfile(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (personalId) {
      fetchProfile();
    }
  }, [personalId]);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 200,
        height: 200
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    };
  }

  function generateSkillsList(skills) {
    if (skills.length < 1) {
      return (
        <ListItem key={1}>
          <ListItemText primary="No skills to display" />
        </ListItem>
      );
    }
    return skills.map((element, index) => (
      <ListItem key={index + 1}>
        <ListItemText primary={element.skill} />
      </ListItem>
    ));
  }
  console.log(personalId);
  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        // alignItems="center"
        sx={{ minHeight: '100vh' }}>
        <div>
          <div className={styles.container}>
            <h1>User info</h1>
            <span className={styles.line}></span>
          </div>
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            sx={{ minWidth: '70vw' }}>
            <div className={styles.avatar}>
              <Avatar {...stringAvatar(profile.name)} />
            </div>
            <div>
              <h3>
                <PermIdentityIcon fontSize="small" /> {' ' + profile.name}
              </h3>
              <h3>
                <PhoneIphoneIcon fontSize="small" /> {profile.mobile}
              </h3>
              <h3>
                <EmailIcon fontSize="small" /> {' ' + profile.email}
              </h3>
              <Link href={profile.linkedinUrl} variant="body2" sx={{ mr: 5 }}>
                <LinkedInIcon fontSize="large" />
              </Link>
              <Link href={profile.githubUrl} variant="body2">
                <GitHubIcon fontSize="large" />
              </Link>
            </div>
            <div>
              <List>
                <ListItem
                  key={0}
                  // disableTypography
                  sx={{ fontFamily: 'Montserrat' }}>
                  <ListItemAvatar>
                    <Avatar>
                      <HandymanIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    sx={{ fontFamily: 'Montserrat' }}
                    primary="Skills"
                  />
                </ListItem>
                <ListItemText
                  disableTypography
                  sx={{
                    '& .MuiTypography-root': {
                      fontFamily: 'Montserrat'
                    }
                  }}
                  primary={
                    profile.skills ? generateSkillsList(profile.skills) : generateSkillsList([])
                  }
                />
                {/* {profile.skills ? generateSkillsList(profile.skills) : generateSkillsList([])} */}
              </List>
            </div>
          </Grid>
        </div>

        <div className={styles.container}>
          <h1>Projects Started</h1>
          <span className={styles.line}></span>
          <ProjectCardsContainer projects={profile.projects} ownerBoolean={true} />
        </div>

        <div className={styles.contributeContainer}>
          <h1>Projects Contributed</h1>
          <span className={styles.line}></span>
          <ContributorProjectCardsContainer userId={personalId} personal={false} />
        </div>
      </Grid>
    </>
  );
}
