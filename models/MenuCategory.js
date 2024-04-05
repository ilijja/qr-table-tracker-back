const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  menuId: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
  },
});

module.exports = mongoose.model("MenuCategory", menuCategorySchema);
