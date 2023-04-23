import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { useRouter } from "next/router";
import Footer from "../../../../components/footer";
import PersonalProfile from "../../../../components/personalProfile";
import styles from "../../../../styles/profilepage.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import config from "../../../../config";
export default function PersonalProfilePage() {
  // Add autho layer for middleware
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const { personalId } = router.query;
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/users?email=${user.email}`
        );
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);

  useEffect(() => {
    const handleRedirect = async () => {
      if (userId && userId != personalId) {
        let preConstructPath = `/profile/${userId}/personal`;
        router.push({
          pathname: preConstructPath,
        });
      }
    };
    handleRedirect();
  }, [userId]);
  return (
    <div className={styles.majorDiv}>
      <NavBar />
      <Category />
      <PersonalProfile personalId={personalId} />
      <Footer />
    </div>
  );
}
