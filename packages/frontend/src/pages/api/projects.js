import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { BACKEND_URL } from "../../constants/backendUrl";

export default withApiAuthRequired(async function projects(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);

    const baseURL = BACKEND_URL;
    console.log(accessToken);
    // This is a contrived example, normally your external API would exist on another domain.
    const response = await fetch(BACKEND_URL + "/projects", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const projects = await response.json();
    res.status(response.status || 200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
});
