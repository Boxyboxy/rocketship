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

export default function ProjectCard({ contribution }) {
  // TODO: Style the cards
  const [funding, setFunding] = useState(0);
  const [projectOwner, setProjectOwner] = useState({ name: "John Doe" });
  const [sample, setSample] = useState({
    status: "pending",
    message:
      "I can contribute to a project by leveraging my UX/UI skills to improve the user experience and interface, creating intuitive designs that enhance usability and delight users.",
    project: {
      id: 1,
      name: "Delivery villian",
      categoryId: 3,
      userId: 1,
      coverImage:
        "https://res.cloudinary.com/dbq7yg58d/image/upload/v1679404360/rocketship/jjdec9oevo6umfkfrzrf.jpg",
      summary: "food delivery platform",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus egestas mollis elit nec aliquet. Duis bibendum mi velit, ut gravida nibh tempor quis. Aenean blandit orci nisi, vel tempor felis varius at. Integer facilisis arcu neque. Sed dignissim lorem et mollis venenatis. Fusce eu urna in sem scelerisque placerat. Proin dictum ligula ex, nec auctor eros pharetra id. Duis fringilla, diam tincidunt imperdiet hendrerit, magna dui gravida odio, sed tincidunt quam arcu vitae diam. Donec varius, leo tristique semper suscipit, enim mi fermentum lacus, in rutrum ante dolor nec turpis. Mauris varius malesuada leo nec volutpat. Morbi imperdiet pulvinar consequat. Pellentesque vehicula fringilla urna vitae vulputate.",
      bankAccountId: 1,
      status: "active",
      location: "singapore",
      githubRepoUrl: "https://github.com/deliveryhero/helm-charts",
      fundingGoal: 10000,
    },
    userSkill: {
      user: {
        id: 1,
        name: "Eugene Ng",
        mobile: "88888888",
        email: "eugenengboxiang@gmail.com",
        linkedinUrl: "https://www.linkedin.com/in/eugenengboxiang/",
        githubUrl: "https://github.com/Boxyboxy",
        createdAt: "2023-04-11T12:29:38.414Z",
        updatedAt: "2023-04-11T12:29:38.414Z",
      },
      skill: {
        id: 3,
        skill: "Data Engineering",
        createdAt: "2023-04-11T12:29:43.084Z",
        updatedAt: "2023-04-11T12:29:43.084Z",
      },
    },
  });

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/fundings/sum/${sample.project.id}`
        );
        console.log(response.data);

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
          `${BACKEND_URL}/users/${sample.project.userId}`
        );
        console.log(response.data);
        setProjectOwner(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjectOwner();
  }, [contribution]);
  console.log(contribution);
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
