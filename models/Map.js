const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  name: { type: String, required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  tables: [{ type: Schema.Types.ObjectId, ref: "Table" }],
});


module.exports = mongoose.model('Map', mapSchema)