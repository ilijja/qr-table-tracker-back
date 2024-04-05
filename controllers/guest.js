const Product = require("../models/Product");
const Menu = require("../models/Menu");
const MenuCategory = require("../models/MenuCategory");
const Table = require("../models/Table");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");

exports.getMenus = (req, res, data) => {
  const tableId = req.params.id;

  Table.findById(tableId)
    .then((table) => {
      if (!table) {
        const error = new Error("Table not found");
        error.status = 404;
        throw error;
      }

      return Restaurant.findById(table.restaurantId);
    })
    .then((restaurant) => {
      return Menu.find({ restaurantId: restaurant._id.toString() });
    })
    .then((menus) => {
      res.status(200).json(menus);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getMenu = (req, res, next) => {
  const menuId = req.params.menuId;

  Menu.findById(menuId)
    .populate({
      path: "categories",
      populate: {
        path: "products",
        model: "Product",
      },
    })
    .then((menu) => {
      if (!menu) {
        const error = new Error("Menu not found");
        error.status = 404;
        throw error;
      }

      res.status(200).json(menu);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrder = (req, res, next) => {
  const tableId = req.params.id;

  Table.findById(tableId)
    .then((table) => {
      return Order.findById(table.order).populate({ path: "items" });
    })
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      console.log(err);
    });
};
