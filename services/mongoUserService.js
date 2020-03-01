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
      // First check wether is already following
      if (await this.alreadyFollowing(idToFollow, user)) {
        console.log("Already following or trying to follow yourself, idiot!");
        const currentUser = await this.User.findById(idToFollow);
        return {
          status: "ko",
          msg: `Already following ${currentUser.username}, how dare you!`
        };
      } else if (idToFollow === user) {
        return {
          status: "ko",
          msg: `You can't follow yourself, dummy`
        };
      } else {
        // Find user to be followed and update Greta Points
        const userToFollow = await this.User.findByIdAndUpdate(idToFollow, {
          $inc: { gretaPoints: 1 }
        });

        // Add user followed to current user
        const currentUser = await this.User.findById(user);
        currentUser.followings.push(userToFollow);
        currentUser.save();
        console.log(
          `${user}, named ${currentUser}, just followed ${idToFollow}, ${userToFollow}`
        );

        // Add current user as a follower
        userToFollow.followers.push(currentUser);
        userToFollow.save();
        return {
          status: "ok",
          msg: `Now you are following ${userToFollow.username}`
        };
      }
    } catch (e) {
      console.log("ERROR IN DATABASE " + e);
      return { status: "ko", msg: "Error following user" };
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

  removeFollowing = async function(idToUnfollow, user) {
    try {
      // Find user to unfollow and remove one Greta point
      const userToUnfollow = await this.User.findByIdAndUpdate(idToUnfollow, {
        $inc: { gretaPoints: -1 }
      });

      // Remove unfollowed user from current user's following array
      const currentUser = await this.User.findById(user);
      await currentUser.followings.splice(
        currentUser.followings.indexOf(userToUnfollow._id),
        1
      );

      // Remove current user from unfollowed user's followers array
      await userToUnfollow.followers.splice(
        userToUnfollow.followers.indexOf(currentUser._id),
        1
      );

      currentUser.save();
      userToUnfollow.save();
      console.log("user to be unfollowed", userToUnfollow, "by ", currentUser);
    } catch (error) {
      console.log("ERROR IN DATABASE ", error);
    }
  };
}

module.exports = new MongoUserService();
