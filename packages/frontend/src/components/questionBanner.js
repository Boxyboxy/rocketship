import { Button } from "@mui/material";
import styles from "../styles/questionbanner.module.css";

export default function QuestionBanner() {
  return (
    <div className={styles.container}>
      <img src="/images/questionBanner.jpg" width="1500px" />
      <div className={styles.centered}>
        <h2>Not sure how it all works?</h2>
        <p>
          {" "}
          If you're looking for some help, you may check out our support page or
          write in to us via hello@rocketship.com
        </p>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#3E497A",
            "&:hover": {
              backgroundColor: "#3E497A",
            },
          }}
        >
          Check our FAQs
        </Button>
      </div>
    </div>
  );
}
