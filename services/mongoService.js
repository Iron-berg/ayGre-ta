class MongoService {
  constructor() {
    this.User = require("../models/user");
  }

  getUsersByName = async function(name) {
    console.log("Mongoose will try to find name " + name);

    const users = await this.User.find({
      username: { $regex: name, $options: "i" }
    });
    //console.log("Mongoose has found these users " + users);

    return users;
  };
}

module.exports = new MongoService();
