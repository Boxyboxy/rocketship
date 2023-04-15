import { Grid } from "@mui/material";
import { useEffect, useState } from "react";

import React from "react";
import useApi from "../../lib/use-api";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function Projects() {
  const { response, error, isLoading } = useApi("/api/projects");

  return (
    <>
      <h1>This page is created for testing.</h1>
      {isLoading && <p>Loading projects...</p>}
      <p>{JSON.stringify(response, null, 2)}</p>
      <p>{JSON.stringify(error, null, 2)}</p>
    </>
  );
});
