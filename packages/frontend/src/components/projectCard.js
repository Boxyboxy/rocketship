import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants/backendUrl";
import axios from "axios";
import { BorderLinearProgress } from "./BorderLinearProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
export default function ProjectCard({ project, ownerBoolean }) {
  const [funding, setFunding] = useState("not loaded");
  const [projectOwner, setProjectOwner] = useState({ name: "John Doe" });
  // TODO: Style the card, set up href for owner profile button
  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/fundings/sum/${project.id}`
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
          `${BACKEND_URL}/users/${project.userId}`
        );

        setProjectOwner(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (project) fetchProjectOwner();
  }, [project]);

  return (
    <Card sx={{ minWidth: 345, maxWidth: 345, margin: 10 }}>
      <CardMedia
        component="img"
        height="140"
        src={project.coverImage}
        alt="project1"
      />
      <CardContent>
        <Stack direction="row" spacing={1}>
          <Typography gutterBottom variant="h5" component="div">
            {project.name}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
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
            Started by:
            {
              <Button size="small" href={`/profile/${projectOwner.id}`}>
                {projectOwner.name}
              </Button>
            }
          </Grid>
        </CardActions>
      )}

      {funding >= project.fundingGoal ? (
        <Chip label="Fully funded!" color="success" />
      ) : (
        <>
          <Typography size="small">
            {` $${funding}/$${project.fundingGoal} raised`}
          </Typography>
          <BorderLinearProgress
            variant="determinate"
            value={(funding * 100) / project.fundingGoal}
          />
        </>
      )}
    </Card>
  );
}
