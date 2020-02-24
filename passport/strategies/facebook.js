const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/user");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos"]
    },

    async function(accessToken, refreshToken, profile, cb) {
      console.log("The FB profile that comes " + JSON.stringify(profile));

      const existingUser = await User.findOne({ facebookId: profile.id });

      if (existingUser) {
        // User exists, so update name from FB
        existingUser.username = profile.displayName;
        existingUser.pictureUrl = profile.photos[0].value;
        console.log(`Existing Facebook user ${existingUser.username}`);
        await existingUser.save();
        return cb(null, existingUser);
      } else {
        const newUser = await User.create({
          username: profile.displayName,
          pictureUrl: profile.photos[0].value,
          facebookId: profile.id
        });
        console.log(`New user from Facebook ${newUser.username}`);
        return cb(null, newUser);
      }
    }
  )
);
