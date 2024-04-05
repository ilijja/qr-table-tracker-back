const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Table = require("../models/Table");
const io = require("../socket");

exports.takeOrder = async (req, res, next) => {
  try {
    const tableId = req.params.tableId;
    const cartItems = req.body.cartItems;

    const table = await Table.findById(tableId);
    if (!table) {
      const error = new Error("Table not found.");
      error.statusCode = 404;
      throw error;
    }

    let order;

    if (table.order) {
      order = await Order.findById(table.order).populate("items");
      let totalAdditionalPrice = 0;

      for (let cartItem of cartItems) {
        let itemUpdated = false;
        for (let item of order.items) {
          if (item.productId.toString() === cartItem._id.toString() && !item.accepted) {
            item.quantity += cartItem.quantity;
            await item.save();
            itemUpdated = true;
            totalAdditionalPrice += cartItem.price * cartItem.quantity;
            break;
          }
        }

        if (!itemUpdated) {
          const newItem = new OrderItem({
            productId: cartItem._id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            name: cartItem.name,
            accepted: false,
            shouldDelete: false,
          });
          const savedNewItem = await newItem.save();
          order.items.push(savedNewItem);
          totalAdditionalPrice += cartItem.price * cartItem.quantity;
        }
      }

      order.totalPrice += totalAdditionalPrice;
      await order.save();
    } else {
      const newOrderItems = await Promise.all(
        cartItems.map(async (cartItem) => {
          const newItem = new OrderItem({
            productId: cartItem._id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            name: cartItem.name,
            accepted: false,
            shouldDelete: false,
          });
          await newItem.save();
          return newItem._id;
        })
      );

      const newOrderTotalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      order = new Order({
        items: newOrderItems,
        totalPrice: newOrderTotalPrice,
        tableId: table._id,
      });

      await order.save();
      table.order = order._id;
      await table.save();
    }

    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      { $set: { fill: "yellow" } },
      { new: true }
    ).populate({
      path: "order",
      populate: {
        path: "items",
        model: "OrderItem",
      },
    });

    io.getIO().emit("table", { table: updatedTable });

    res
      .status(200)
      .json({ message: "Order updated successfully", table: updatedTable });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};


exports.acceptOrders = async (req, res, next) => {
  try {
    const { selectedOrders, unselectedOrders, tableId, orderId } = req.body;

    let order = await Order.findById(orderId).populate("items");

    const selectedIds = selectedOrders.map(item => item._id);
    const unselectedIds = unselectedOrders.map(item => item._id);
    const allRelevantIds = [...new Set([...selectedIds, ...unselectedIds])];

    const itemsToDelete = order.items.filter(item => !allRelevantIds.includes(item._id.toString()));
    for (const item of itemsToDelete) {
      await OrderItem.findByIdAndDelete(item._id);
    }

    for (const selectedItem of selectedOrders) {
      await OrderItem.findByIdAndUpdate(selectedItem._id, {
        quantity: selectedItem.quantity,
        accepted: true
      });
    }

    await Order.findByIdAndUpdate(orderId, {
      $pull: { items: { $in: itemsToDelete.map(item => item._id) } }
    });

    const updatedOrderItems = await OrderItem.find({ _id: { $in: order.items.map(item => item._id) } });
    const hasUnacceptedItems = updatedOrderItems.some(item => !item.accepted);

    await Table.findByIdAndUpdate(tableId, { fill: hasUnacceptedItems ? "yellow" : "red" });

    const updatedTable = await Table.findById(tableId).populate({
      path: "order",
      populate: {
        path: "items",
      },
    });

    io.getIO().emit("table", { table: updatedTable });

    res.status(200).json({ message: "Orders accepted successfully", table: updatedTable });
  } catch (err) {
    console.error(err);
    next(err); 
  }
};
