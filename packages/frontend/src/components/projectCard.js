import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import { BorderLinearProgress } from "./BorderLinearProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import styles from "../styles/projectcard.module.css";

export default function ProjectCard({ project, ownerBoolean }) {
  const [funding, setFunding] = useState("0");
  const [projectOwner, setProjectOwner] = useState({ name: "John Doe" });
  // TODO: Style the card, set up href for owner profile button

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/fundings/sum/${project.id}`
        );

        if (
          isNaN(response.data) ||
          +response.data > Number.MAX_SAFE_INTEGER ||
          +response.data < 0
        ) {
          setFunding(response.data);
        } else {
          setFunding(`${response.data} `);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (project) fetchFunding();
  }, [project]);

  useEffect(() => {
    const fetchProjectOwner = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/users/${project.userId}`
        );

        setProjectOwner(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (project) fetchProjectOwner();
  }, [project]);

  return (
    <div>
      <Link className={styles.name} href={`/projects/${project.id}`}>
        <Card
          sx={{
            maxWidth: 345,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          <CardMedia
            sx={{ height: 140 }}
            component="img"
            src={project.coverImage}
            alt="project1"
          />
          <CardContent sx={{ height: 120, overflow: "hidden" }}>
            <Stack direction="row" spacing={1}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontFamily: "Montserrat" }}
              >
                {project.name}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: "Montserrat" }}
            >
              {project.summary}
            </Typography>
          </CardContent>
          {ownerBoolean ? (
            ""
          ) : (
            <CardActions>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {
                  <Button
                    size="small"
                    href={`/profile/${projectOwner.id}`}
                    sx={{ fontFamily: "Montserrat" }}
                  >
                    {projectOwner.name}
                  </Button>
                }
              </Grid>
            </CardActions>
          )}

          {funding >= project.fundingGoal ? (
            <Chip
              label="Fully funded!"
              color="success"
              sx={{ marginLeft: "10px", marginBottom: "10px" }}
            />
          ) : (
            <>
              <Typography
                size="small"
                sx={{
                  fontFamily: "Montserrat",
                  float: "right",
                  marginRight: "10px",
                  marginBottom: "18px",
                }}
              >{` $${funding}/$${project.fundingGoal} raised`}</Typography>
              <BorderLinearProgress
                variant="determinate"
                sx={{ marginLeft: "10px" }}
                value={(funding * 100) / project.fundingGoal}
              />
            </>
          )}
        </Card>
      </Link>
    </div>
  );
}
