import NavBar from "../../../components/navbar";
import Category from "../../../components/category";
import { useRouter } from "next/router";
import Footer from "../../../components/footer";
import PublicProfile from "../../../components/publicProfile";
import styles from "../../../styles/profilepage.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { personalId } = router.query;
  return (
    <div className={styles.majorDiv}>
      <NavBar />
      <Category />
      <PublicProfile personalId={personalId} />
      <Footer />
    </div>
  );
}
