import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import React from "react";
import useApi from "../../lib/use-api";

export default function Users() {
  // using a custom hook
  const { response, error, isLoading } = useApi("/api/users/4", "patch", {
    name: "dummy tan",
    mobile: "88889999",
    email: "dummy@gmail.com",
    githubUrl: "https://github.com/superleexpert",
    linkedinUrl: "https://www.linkedin.com/in/dummy-profile-CHANGED/",
    newSkills: ["UI/UX Design", "Data Engineering"],
  });
  // not using a custom hook
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios({
  //         url: "/api/users/4",
  //         responseType: "json",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         method: "patch",
  //         data: {
  //           name: "dummy toh",
  //           mobile: "88889999",
  //           email: "dummy@gmail.com",
  //           githubUrl: "https://github.com/superleexpert",
  //           linkedinUrl: "https://www.linkedin.com/in/dummy-profile-CHANGED/",
  //           newSkills: ["UI/UX Design", "Data Engineering"],
  //         },
  //       });

  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch user data:", error);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  return (
    <>
      <h1>This page is created for testing.</h1>
      {isLoading && <p>Loading projects...</p>}
      {!isLoading && (
        <>
          {" "}
          <p>{JSON.stringify(response.data, null, 2)}</p>
          {JSON.stringify(error, null, 2)}{" "}
        </>
      )}
    </>
  );
}
