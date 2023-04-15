import NavBar from "../../../../components/navbar";
import Category from "../../../../components/category";
import { useRouter } from "next/router";
import Footer from "../../../../components/footer";
import PersonalProfile from "../../../../components/personalProfile";
import styles from "../../../../styles/profilepage.module.css";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../../constants/backendUrl";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "@auth0/nextjs-auth0/client";
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
          `${BACKEND_URL}/users?email=${user.email}`
        );
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, [user]);
  console.log(user);
  console.log(isLoading);
  console.log(error);
  useEffect(() => {
    const handleRedirect = async () => {
      if (userId != personalId) {
        router.push({
          pathname: `/profile/${userId}/personal`,
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
