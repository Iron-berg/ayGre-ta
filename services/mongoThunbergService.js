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

  likeThunberg = async function(thunbergid, userid) {
    try {
      // If the thunberg belongs to the user don't allow to like it
      const th = await this.Thunberg.findById(thunbergid);

      if (th.author != userid) {
        // Check if the thunberg has already been faved by user
        const currentUser = await this.User.findById(userid);

        if (!currentUser.favoriteThunbergs.includes(thunbergid)) {
          // Not faved, then fav

          // Get thunberg by id and increase one like
          const thunberg = await this.Thunberg.findByIdAndUpdate(thunbergid, {
            $inc: { likes: 1 }
          });

          // Find author and increase two Greta points
          const author = await this.User.findByIdAndUpdate(thunberg.author, {
            $inc: { gretaPoints: 2 }
          });

          // Add thunberg as a favorite of current user
          //const currentUser = await this.User.findById(userid);
          currentUser.favoriteThunbergs.push(thunberg);
          currentUser.save();
        } else {
          // Already faved, then unfav
          // Get thunberg by id and decrease one like
          const thunberg = await this.Thunberg.findByIdAndUpdate(thunbergid, {
            $inc: { likes: -1 }
          });

          // Find author and decrease two Greta points
          const author = await this.User.findByIdAndUpdate(thunberg.author, {
            $inc: { gretaPoints: -2 }
          });

          // Delete thunberg as a favorite of current user
          //const currentUser = await this.User.findById(userid);
          let index = currentUser.favoriteThunbergs.indexOf(thunbergid);
          if (index !== -1) currentUser.favoriteThunbergs.splice(index, 1);
          currentUser.save();
        }
      }
    } catch (error) {
      console.log(`ERROR MongoThunbergService likeThunberg ${error}`);
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

      // Sort thunbergs by date
      allThunbergs.sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Check whether the thunberg is a fav of user
      allThunbergs.forEach(t => {
        if (thunbergsUser.favoriteThunbergs.includes(t.id)) {
          t.favorite = true;
        }
      });

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
