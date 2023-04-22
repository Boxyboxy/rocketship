import NavBar from "../../../components/navbar";
import Category from "../../../components/category";
import { useRouter } from "next/router";
import Footer from "../../../components/footer";
import PublicProfile from "../../../components/publicProfile";
import styles from "../../../styles/profilepage.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import config from "../../../config";
export default function ProfilePage() {
  const router = useRouter();
  const { personalId } = router.query;
  const { user, isLoading, error, getAccessTokenSilently, isAuthenticated } =
    useUser();
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
  console.log(user);
  console.log(isLoading);
  console.log(error);

  useEffect(() => {
    const handleRedirect = async () => {
      if (userId && userId == personalId) {
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
      <PublicProfile personalId={personalId} />
      <Footer />
    </div>
  );
}
