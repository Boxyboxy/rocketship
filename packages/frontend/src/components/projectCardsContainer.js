import styles from "../styles/projectCardsContainer.module.css";
import ProjectCard from "./projectCard";
export default function ProjectCardsContainer({ projects, ownerBoolean }) {
  function generateCards(projects) {
    if (!projects) {
      return (
        // TODO: Display message that there are not projects
        <ProjectCard
          project={{
            id: 8,
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
            createdAt: "2023-04-08T03:23:26.213Z",
            updatedAt: "2023-04-08T03:23:26.213Z",
          }}
        />
      );
    }
    return projects.map((project, index) => (
      <ProjectCard key={index} project={project} ownerBoolean={ownerBoolean} />
    ));
  }

  return <div className={styles.cardsContainer}>{generateCards(projects)}</div>;
}
