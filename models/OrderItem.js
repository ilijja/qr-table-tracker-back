const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 
    },
    accepted: {
        type: Boolean,
        required: true
    },
    shouldUpdate: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);

