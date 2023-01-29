const expressJwt = require("express-jwt");
const config = require("config.json");
const userService = require("../models/users/user.service");

module.exports = jwt;

function jwt() {
  const secret = config.secret;
  return expressJwt({ secret, algorithms: ["HS256"], isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      "/files",
      /^\/files\/create\/.*/,
      "/shops",
      /^\/shops\/create\/.*/,
      "/users",
      "/users/create",
      "/users/auth",
    ],
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
}