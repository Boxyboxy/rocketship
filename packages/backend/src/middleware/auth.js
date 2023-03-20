// not being used now
const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
module.exports = auth({
  audience: "http://localhost:3001",
  issuerBaseURL: "https://dev-v142ohfthr7u4kgs.au.auth0.com",
});
