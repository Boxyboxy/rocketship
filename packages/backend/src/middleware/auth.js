const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
module.exports = auth({
  audience: "https://dev-v04wep3w5lcfmqqx.us.auth0.com/api/v2/",
  issuerBaseURL: "https://dev-v04wep3w5lcfmqqx.us.auth0.com",
  tokenSigningAlg: "RS256",
});
