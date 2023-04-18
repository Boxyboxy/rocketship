//not being used now

const axios = require("axios");

function isAdmin(req, res, next) {
  axios
    .get(`https://dev-v04wep3w5lcfmqqx.us.auth0.com`, {
      headers: { Authorization: `${req.headers.authorization}` },
    })
    .then(({ data }) => {
      req.email = data.email;
      next();
    });
}
module.exports = isAdmin;
