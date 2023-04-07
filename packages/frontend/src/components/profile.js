import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import styles from "../styles/profile.module.css";

export default function Profile({ personalId }) {
  const [profile, setProfile] = useState({
    name: "John Doe",
    mobile: "81112222",
    email: "johndoe@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/johndoe/",
    githubUrl: "https://github.com/johndoe",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/users/${personalId}`
        );

        console.log(response.data);

        setProfile(response.data);
      } catch (err) {
        console.log(err);
      }
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

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <div className={styles.avatar}>
          <Avatar {...stringAvatar(profile.name)} />
        </div>

        <Grid item xs={6}>
          <Item>1</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>2</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>3</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>4</Item>
        </Grid>
      </Grid>
    </>
  );
}
