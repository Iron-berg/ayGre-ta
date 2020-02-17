const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const thunbergSchema = new Schema(
  {
    message: { type: String, required: true },
    likes: { type: Number, default: 0 },
    author: { type : Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const Thunberg = mongoose.model("Thunberg", thunbergSchema);

module.exports = Thunberg;