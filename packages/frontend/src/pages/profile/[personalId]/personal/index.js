import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { useRouter } from "next/router";
import Footer from "../../../../components/footer";
import PersonalProfile from "../../../../components/personalProfile";
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
