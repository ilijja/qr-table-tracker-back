const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: { type: String, required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  categories: [{ type: Schema.Types.ObjectId, ref: "MenuCategory" }],
});

module.exports = mongoose.model("Menu", menuSchema);
