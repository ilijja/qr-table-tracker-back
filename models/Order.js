const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    totalPrice: {
        type: Number,
        required: true,
    },
    tableId: {
        type: Schema.Types.ObjectId,
        ref: "Table",
        required: true,
    },
    paid: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema);