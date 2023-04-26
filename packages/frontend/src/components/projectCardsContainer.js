import styles from "../styles/projectCardsContainer.module.css";
import ProjectCard from "./projectCard";
export default function ProjectCardsContainer({ projects, ownerBoolean }) {
  function generateCards(projects) {
    // console.log(projects);
    if (!projects) {
      return <h2> No projects</h2>;
    }
    if (projects.length < 1) {
      return <h2> No projects</h2>;
    }
    return projects.map((project, index) => (
      <ProjectCard key={index} project={project} ownerBoolean={ownerBoolean} />
    ));
  }

  return <div className={styles.cardsContainer}>{generateCards(projects)}</div>;
}
