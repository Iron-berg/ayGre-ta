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
      console.log(
        `MongoThunbergService postThunberg - Thunberg created ${thunberg}`
      );

      // Add Thunberg to user
      const currentUser = await this.User.findById(author);
      currentUser.thunbergs.push(thunberg);
      currentUser.save();
      console.log(
        `MongoThunbergService postThunberg - Thunberg saved to user ${currentUser}`
      );
    } catch (error) {
      console.log(`ERROR MongoThunbergService postThunberg ${error}`);
    }
  };
}

module.exports = new MongoThunbergService();
