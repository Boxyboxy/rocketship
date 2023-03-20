//not being used now

const axios = require("axios");

function isAdmin(req, res, next) {
  axios
    .get(`https://dev-v142ohfthr7u4kgs.au.auth0.com/userinfo`, {
      headers: { Authorization: `${req.headers.authorization}` },
    })
    .then(({ data }) => {
      req.email = data.email;
      next();
    });
}
module.exports = isAdmin;
