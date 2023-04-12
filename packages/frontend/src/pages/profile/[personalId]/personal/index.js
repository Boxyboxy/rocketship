import Head from "next/head";
import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Footer from "../../../../components/footer";
import PersonalProfile from "../../../../components/personalProfile";
import Grid from "@mui/material/Grid";
import styles from "../../../../styles/profilepage.module.css";

export default function PersonalProfilePage() {
  // Add autho layer for middleware

  const router = useRouter();
  const { personalId } = router.query;
  return (
    <div className={styles.majorDiv}>
      <NavBar />
      <Category />
      <PersonalProfile personalId={personalId} />
      <Footer />
    </div>
  );
}
