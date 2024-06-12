const SamlStrategy = require("@node-saml/passport-saml").Strategy;
const fs = require("fs");

module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
    providers: [
      {
        uid: "saml",
        displayName: "Okta",
        icon: "https://www.okta.com/sites/default/files/Okta_Logo_BrightBlue_Medium-thumbnail.png",
        createStrategy: (strapi) =>
          new SamlStrategy(
            {
              callbackURL:
                strapi.config.server.url +
                strapi.admin.services.passport.getStrategyCallbackURL("saml"),
              cert: fs.readFileSync(env("SAML_CERT_PATH"), "utf-8"),
              entryPoint: env("SAML_ENTRYPOINT_URL"),
              issuer: "passport-saml",
              // This is most likely the entry ID but depends on the SAML provider
              audience: "http://localhost:1337/admin/connect/saml",
            },
            (profile, done) => {
              done(null, {
                email: profile.email,
                username: profile.username,
                firstname: profile.attributes.firstname,
                lastname: profile.attributes.lastname,
              });
            }
          ),
      },
    ],
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
