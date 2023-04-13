import { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import styles from "../styles/profile.module.css";
import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HandymanIcon from "@mui/icons-material/Handyman";
import ProjectCard from "./projectCard";
import ProjectCardsContainer from "./projectCardsContainer";
import { BACKEND_URL } from "../constants/backendUrl";
import ContributorProjectCardsContainer from "./contributorProjectCardsContainer";
import FundingHistory from "./FundingHistory";

export default function PublicProfile({ personalId }) {
  // TODO: add edit button that links to edit page.
  // Figure out a way to display funding, a table?
  const [profile, setProfile] = useState({
    name: "John Doe",
    mobile: "81112222",
    email: "johndoe@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/johndoe/",
    githubUrl: "https://github.com/johndoe",
    skills: [
      { skill: "UI/UX Design" },
      { skill: "Web Development" },
      { skill: "Digital Marketing" },
    ],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users/${personalId}`);

        setProfile(response.data);
      } catch (err) {}
    };

    fetchProfile();
  }, [personalId]);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";

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
        height: 200,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  function generateSkillsList(skills) {
    if (skills.length < 1) {
      return (
        <ListItem>
          <ListItemText primary="No skills to display" />
        </ListItem>
      );
    }
    return skills.map((element) => (
      <ListItem>
        <ListItemText primary={element.skill} />
      </ListItem>
    ));
  }

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <div>
          <h1>User info</h1>
          <span className={styles.line}></span>
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            sx={{ minWidth: "70vw" }}
          >
            <div className={styles.avatar}>
              <Avatar {...stringAvatar(profile.name)} />
            </div>
            <div>
              <h3>
                <PermIdentityIcon fontSize="small" /> {" " + profile.name}
              </h3>
              <h3>
                <PhoneIphoneIcon fontSize="small" /> {profile.mobile}
              </h3>
              <h3>
                <EmailIcon fontSize="small" /> {" " + profile.email}
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
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <HandymanIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Skills" />
                </ListItem>

                {profile.skills
                  ? generateSkillsList(profile.skills)
                  : generateSkillsList([])}
              </List>
            </div>
          </Grid>
        </div>

        <div>
          <h1>Projects Started</h1>
          <span className={styles.line}></span>
          <ProjectCardsContainer projects={profile.projects} />
        </div>
        {/* to change the data input*/}
        <div>
          <h1>Projects Contributed</h1>
          <span className={styles.line}></span>
          <ContributorProjectCardsContainer userId={profile.id} />
        </div>
        {/* to change the data input*/}
        <div>
          <h1>Funding History</h1>
          <span className={styles.line}></span>
          <FundingHistory personalId={personalId} />
        </div>
      </Grid>
    </>
  );
}
