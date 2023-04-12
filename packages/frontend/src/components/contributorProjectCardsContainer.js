import styles from "../styles/projectCardsContainer.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ContributorProjectCard from "./contributorProjectCard";
import { BACKEND_URL } from "../constants/backendUrl";
export default function ProjectCardsContainer({ userId }) {
  const [contributions, setContributions] = useState([
    {
      id: 5,
      projectId: 1,
      userSkillId: 1,
      status: "pending",
      message:
        "I can contribute to a project by leveraging my UX/UI skills to improve the user experience and interface, creating intuitive designs that enhance usability and delight users.",
      createdAt: "2023-04-11T12:33:28.137Z",
      updatedAt: "2023-04-11T12:33:28.137Z",
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
        createdAt: "2023-04-11T12:32:01.937Z",
        updatedAt: "2023-04-11T12:32:01.937Z",
      },
      userSkill: {
        id: 1,
        skillId: 3,
        userId: 1,
        createdAt: "2023-04-11T12:29:49.598Z",
        updatedAt: "2023-04-11T12:29:49.598Z",
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
    },
  ]);
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/contributions?userId=${userId}`
        );

        console.log(response.data);

        setContributions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchContributions();
  }, []);

  function generateCards(contributions) {
    return contributions.map((contribution) => (
      <ContributorProjectCard contribution={contribution} />
    ));
  }

  return (
    <div className={styles.cardsContainer}>{generateCards(contributions)}</div>
  );
}
