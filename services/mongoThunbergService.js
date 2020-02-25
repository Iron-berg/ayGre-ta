class MongoThunbergService {
  constructor() {
    this.Thunberg = require("../models/thunberg");
    this.User = require("../models/user");
  }

  postThunberg = async function(message, author) {
    try {
      const t = new this.Thunberg({
        message: message,
        author: author
      });

      // Create Thunberg
      const thunberg = await this.Thunberg.create(t);

      // Add Thunberg to user
      const currentUser = await this.User.findById(author);
      currentUser.thunbergs.push(thunberg);
      currentUser.save();
    } catch (error) {
      console.log(`ERROR MongoThunbergService postThunberg ${error}`);
    }
  };

  getRelatedThunbergs = async function(user) {
    try {
      let allThunbergs = [];

      // Get logged user thunbergs
      const thunbergsUser = await this.User.findById(user).populate({
        path: "thunbergs",
        model: this.Thunberg,
        populate: {
          path: "author",
          model: this.User
        }
      });
      allThunbergs.push(...thunbergsUser.thunbergs);

      // Get followings from user
      const followings = await this.User.findById(user).populate("followings");

      // Get thunbergs from each following
      const followingThunbergs = await this._getThunbergsFromUsers(
        followings.followings
      );

      if (followingThunbergs.length > 0)
        allThunbergs.push(...followingThunbergs);

      return allThunbergs;
    } catch (error) {
      console.log(`ERROR MongoThunbergService getRelatedThunbergs ${error}`);
    }
  };

  _getThunbergsFromUsers = async function(users) {
    let totalThunbergs = [];
    for (let i = 0; i < users.length; i++) {
      let usr = await this.User.findById(users[i].id).populate({
        path: "thunbergs",
        model: this.Thunberg,
        populate: {
          path: "author",
          model: this.User
        }
      });

      totalThunbergs.push(...usr.thunbergs);
    }

    return totalThunbergs;
  };
}

module.exports = new MongoThunbergService();
