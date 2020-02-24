class MongoThunbergService {
  constructor() {
    this.Thunberg = require("../models/thunberg");
  }

  postThunberg = async function(message, author) {
    try {
      const thunberg = new Thunberg({
        message: message,
        author: author
      });

      const obj = await this.Thunberg.create(thunberg);
      console.log(
        `MongoThunbergService postThunberg - Thunberg created ${obj}`
      );
    } catch (error) {
      console.log(`ERROR MongoThunbergService postThunberg ${error}`);
    }
  };
}
