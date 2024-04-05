const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tableSchema = new Schema({
    shape: {
        type: String,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    fill: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    paid: {
        type: Boolean,
        required: true,
    },
    mapId: {
        type: Schema.Types.ObjectId,
        ref: "Map"
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },

})

module.exports = mongoose.model("Table", tableSchema);
