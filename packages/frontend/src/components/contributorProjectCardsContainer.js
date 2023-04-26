import styles from "../styles/projectCardsContainer.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ContributorProjectCard from "./contributorProjectCard";
import config from "../config";
export default function ContributorProjectCardsContainer({ userId, personal }) {
  const [contributions, setContributions] = useState([]);
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const status = personal ? "" : "&status=accepted";
        const response = await axios.get(
          `${config.apiUrl}/contributions?userId=${userId}${status}`
        );

        setContributions(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (userId) {
      fetchContributions();
    }
  }, [userId]);

  function generateCards(contributions) {
    if (contributions.length < 1) {
      return <h2> No contributions</h2>;
    }
    return contributions.map((contribution, index) => (
      <ContributorProjectCard key={index} contribution={contribution} />
    ));
  }

  return (
    <div className={styles.cardsContainer}>{generateCards(contributions)}</div>
  );
}
