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

export default function ContributorProjectCard({ contribution }) {
  // TODO: Style the cards
  const [funding, setFunding] = useState(0);
  const [projectOwner, setProjectOwner] = useState({ name: "John Doe" });
  const [sample, setSample] = useState({});

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/fundings/sum/${contribution.projectId}`
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
          `${BACKEND_URL}/users/${contribution.project.userId}`
        );

        setProjectOwner(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjectOwner();
  }, [contribution]);

  return (
    <Card sx={{ minWidth: 345, maxWidth: 345, margin: 10 }}>
      <CardMedia
        component="img"
        height="140"
        src={contribution.project.coverImage}
        alt="project1"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {contribution.project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contribution.project.summary}
        </Typography>
      </CardContent>
      <CardActions>
        Started by:
        {<Button size="small">{projectOwner.name}</Button>}
      </CardActions>
      <Typography size="small">
        {` $${funding}/$${contribution.project.fundingGoal} raised`}
      </Typography>
      <BorderLinearProgress
        variant="determinate"
        value={(funding * 100) / contribution.project.fundingGoal}
      />
      <Typography size="small">
        {`Skill contributed: ${contribution.userSkill.skill.skill}`}
      </Typography>
    </Card>
  );
}
