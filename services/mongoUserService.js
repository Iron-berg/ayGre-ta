class MongoUserService {
  constructor() {
    this.User = require("../models/user");
  }

  getUsersByName = async function(name) {
    const users = await this.User.find({
      username: { $regex: name, $options: "i" }
    });

    return users;
  };

  addFollowed = async function(idToFollow, user) {
    try {
      // First check wether is already following or it is himself or herself
      if (
        (await this.alreadyFollowing(idToFollow, user)) ||
        idToFollow === user
      ) {
        console.log("Already following or trying to follow yourself, idiot!");
      } else {
        // Find user to be followed and update Greta Points
        const userToFollow = await this.User.findByIdAndUpdate(idToFollow, {
          $inc: { gretaPoints: 1 }
        });

        // Add user followed to current user
        const currentUser = await this.User.findById(user);
        currentUser.followings.push(userToFollow);
        currentUser.save();

        // Add current user as a follower
        userToFollow.followers.push(currentUser);
        userToFollow.save();
      }
    } catch (e) {
      console.log("ERROR IN DATABASE " + e);
    }
  };

  alreadyFollowing = async function(idToFollow, user) {
    let following = false;
    const found = await this.User.findById(user).populate("followings");

    found.followings.forEach(f => {
      if (f.id === idToFollow) following = true;
    });

    return following;
  };
}

module.exports = new MongoUserService();
