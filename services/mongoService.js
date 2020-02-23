class MongoService {
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
        console.log("Already following");
      } else {
        // Find user to be followed and update followers
        const userToFollow = await this.User.findByIdAndUpdate(idToFollow, {
          $inc: { followers: 1 }
        });

        // Add user followed to current user
        const currentUser = await this.User.findById(user);
        currentUser.followings.push(userToFollow);
        currentUser.save();
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

module.exports = new MongoService();
