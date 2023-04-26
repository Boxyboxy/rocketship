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
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function ProjectCard({ project, ownerBoolean }) {
  const [funding, setFunding] = useState("0");

  const [projectOwner, setProjectOwner] = useState({ name: "John Doe" });

  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/users?email=${user.email}`
        );
        setUserId(response.data[0].id);
        console.log(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);

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

  const handleEditButtonClick = () => {
    router.push({
      pathname: `/projects/${project.id}/edit`,
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      {" "}
      <CardMedia
        sx={{ height: 140 }}
        component="img"
        src={project.coverImage}
        alt="project1"
      />
      <CardContent sx={{ height: 120, overflow: "hidden" }}>
        <Stack direction="row" spacing={1}>
          <Link className={styles.projectName} href={`/projects/${project.id}`}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontFamily: "Montserrat" }}
            >
              {project.name}
            </Typography>
          </Link>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "Montserrat" }}
        >
          {project.summary}
        </Typography>
      </CardContent>
      {project.userId === userId && (
        <div>
          <br />
          <Button
            sx={{
              float: "right",
              color: "white",
              margin: "0px 10px",
              backgroundColor: "#21325E",
              "&:hover": {
                backgroundColor: "#21325E",
              },
            }}
            onClick={handleEditButtonClick}
          >
            Edit
          </Button>
        </div>
      )}
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
              <Link
                size="small"
                className={styles.name}
                href={`/profile/${projectOwner.id}`}
                sx={{ fontFamily: "Montserrat" }}
              >
                {projectOwner.name}
              </Link>
            }
          </Grid>
        </CardActions>
      )}
      {funding >= project.fundingGoal ? (
        <Chip
          label="Fully funded!"
          color="success"
          size="small"
          sx={{ marginLeft: "10px", marginBottom: "10px" }}
        />
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
          >{` $${funding}/$${project.fundingGoal} raised`}</Typography>
          <BorderLinearProgress
            variant="determinate"
            sx={{ marginLeft: "10px" }}
            value={(funding * 100) / project.fundingGoal}
          />
        </span>
      )}{" "}
    </Card>
  );
}
