// pages/api/auth/[...auth0].js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      authorizationParams: {
        audience: 'https://dev-v04wep3w5lcfmqqx.us.auth0.com/api/v2/', // or AUTH0_AUDIENCE
        // Add the `offline_access` scope to also get a Refresh Token
        scope: 'openid profile email read:products' // or AUTH0_SCOPE
      },
      // returnTo: "/##DESIREDPATH##",
      returnTo: '/create-profile'
    });
  }
});
