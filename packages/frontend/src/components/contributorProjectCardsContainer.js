import styles from "../styles/projectCardsContainer.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ContributorProjectCard from "./contributorProjectCard";
import { config } from "../config";
export default function ContributorProjectCardsContainer({ userId }) {
  // TODO: Display message if there are no contributions
  const [contributions, setContributions] = useState([]);
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/contributions?userId=${userId}`
        );

        setContributions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchContributions();
  }, [userId]);

  function generateCards(contributions) {
    return contributions.map((contribution) => (
      <ContributorProjectCard contribution={contribution} />
    ));
  }

  return (
    <div className={styles.cardsContainer}>{generateCards(contributions)}</div>
  );
}
