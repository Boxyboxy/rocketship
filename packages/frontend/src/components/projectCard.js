import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
export default function ProjectCard({ project }) {
  const [funding, setFunding] = useState("funding not loaded");
  const [projectOwner, setProjectOwner] = useState({ name: "John Doe" });

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const response = await axios.get(
          `https://localhost:8080/fundings/sum/${project.id}`
        );
        console.log(response.data);
        setFunding(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFunding();
  }, [project]);

  useEffect(() => {
    const fetchProjectOwner = async () => {
      try {
        const response = await axios.get(
          `https://localhost:8080/users/${project.userId}`
        );
        console.log(response.data);
        setProjectOwner(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjectOwner();
  }, [project]);
  console.log(project);
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        src={project.coverImage}
        alt="project1"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.summary}
        </Typography>
      </CardContent>
      <CardActions>
        {<Button size="small">{projectOwner.name}</Button>}
        <Typography size="small">{funding} funded</Typography>
      </CardActions>
    </Card>
  );
}
