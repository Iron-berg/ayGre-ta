const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/user");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },

    async function(accessToken, refreshToken, profile, cb) {
      console.log(profile);

      const existingUser = await User.findOne({ facebookId: profile.id });

      if (existingUser) {
        // User exists, so update name from FB
        existingUser.username = profile.email;
        existingUser.pictureUrl = profile.profile_pic;
        console.log(`Existing Facebook user ${existingUser.username}`);
        await existingUser.save();
        return cb(null, existingUser);
      } else {
        const newUser = await User.create({
          username: profile.email,
          pictureUrl: profile.profile_pic,
          facebookId: profile.id
        });
        console.log(`New user from Facebook ${newUser.username}`);
        return cb(null, newUser);
      }
    }
  )
);
