import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import { BorderLinearProgress } from "./BorderLinearProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import styles from "../styles/projectcard.module.css";

export default function ContributorProjectCard({ contribution }) {
  // TODO: Style the cards
  const [funding, setFunding] = useState(0);
  const [projectOwner, setProjectOwner] = useState({ name: "John Doe" });

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/fundings/sum/${contribution.projectId}`
        );

        if (
          isNaN(response.data) ||
          +response.data > Number.MAX_SAFE_INTEGER ||
          +response.data < 0
        ) {
          setFunding(response.data);
        } else {
          setFunding(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchFunding();
  }, [contribution]);

  useEffect(() => {
    const fetchProjectOwner = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/users/${contribution.project.userId}`
        );

        setProjectOwner(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjectOwner();
  }, [contribution]);

  return (
    <Card
      sx={{
        minWidth: 345,
        maxWidth: 345,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        src={contribution.project.coverImage}
        alt="project1"
      />
      <CardContent>
        <Stack direction="row" spacing={1}>
          <Link
            className={styles.name}
            href={`/projects/${contribution.project.id}`}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontFamily: "Montserrat" }}
            >
              {contribution.project.name}
            </Typography>
          </Link>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "Montserrat" }}
        >
          {contribution.project.summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          Started by:
          {
            <Link
              size="small"
              href={`/profile/${projectOwner.id}`}
              sx={{ fontFamily: "Montserrat" }}
            >
              {projectOwner.name}
            </Link>
          }
        </Grid>
      </CardActions>
      {funding >= contribution.project.fundingGoal ? (
        <Chip label="Fully funded!" color="success" />
      ) : (
        <span>
          <Typography
            size="small"
            sx={{
              fontFamily: "Montserrat",
              float: "right",
              marginRight: "10px",
              marginBottom: "18px",
            }}
          >
            {` $${funding}/$${contribution.project.fundingGoal} raised`}
          </Typography>
          <BorderLinearProgress
            variant="determinate"
            sx={{ marginLeft: "10px" }}
            value={(funding * 100) / contribution.project.fundingGoal}
          />
        </span>
      )}

      <Typography
        size="small"
        sx={{
          fontFamily: "Montserrat",
        }}
      >
        {`Skill contributed: ${contribution.userSkill.skill.skill}`}
      </Typography>
    </Card>
  );
}
