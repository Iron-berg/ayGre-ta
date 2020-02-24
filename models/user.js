const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, index: true, unique: true, required: true },
    name: String,
    password: { type: String },
    facebookId: String,
    pictureUrl: String,
    gretaPoints: { type: Number, default: 0 },
    favoriteNews: [{ type: Schema.Types.ObjectId, ref: "News" }],
    thunbergs: [{ type: Schema.Types.ObjectId, ref: "Thunberg" }],
    followers: { type: Number, default: 0 },
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
