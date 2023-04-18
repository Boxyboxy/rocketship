import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import config from "../../../config";

export default withApiAuthRequired(async function users(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);

    console.log(accessToken);
    // This is a contrived example, normally your external API would exist on another domain.
    const response = await axios.patch(
      `${config.apiUrl}/users/${req.query.userId}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);

    const users = response.data;

    res.status(response.status || 200).json(users);
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
});
