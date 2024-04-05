const io = require("../socket");

const Map = require("../models/Map");
const Table = require("../models/Table");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

exports.addMap = (req, res, next) => {
  const userId = req.userId;
  const tables = JSON.parse(req.body.tables);
  const mapName = JSON.parse(req.body.mapName);

  const map = new Map({
    name: mapName,
    restaurantId: userId,
    tables: [],
  });

  map
    .save()
    .then((map) => {
      const saveTablePromises = tables.map((table) => {
        const { _id, ...filteredTable } = table;
        const newTable = new Table({
          ...filteredTable,
          mapId: map._id,
          restaurantId: req.userId,
          order: null,
          paid: true,
        });
        return newTable.save();
      });

      return Promise.all(saveTablePromises);
    })
    .then((savedTables) => {
      map.tables = savedTables;

      return map.save();
    })
    .then((map) => {
      res.status(200).json(map);
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.getMap = (req, res, next) => {
  Map.find({ restaurantId: req.userId })
    .populate({
      path: "tables",
      populate: {
        path: "order",
        model: "Order",
        populate: {
          path: "items",
          model: "OrderItem",
        },
      },
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editMap = async (req, res, next) => {
  try {
    const updatedMapData = JSON.parse(req.body.map);
    const map = await Map.findById(updatedMapData._id);

    if (!map) {
      const error = new Error("Map not found");
      error.status = 401;
      throw error;
    }

    map.name = updatedMapData.name;

    const updatedTableIds = updatedMapData.tables.map((table) => table._id);

    const tablesToRemove = map.tables.filter(
      (tableId) => !updatedTableIds.includes(tableId.toString())
    );
    for (const tableId of tablesToRemove) {
      await Table.findByIdAndDelete(tableId);
    }

    for (const tableData of updatedMapData.tables) {
      if (mongoose.isValidObjectId(tableData._id)) {
        await Table.findByIdAndUpdate(tableData._id, tableData, { new: true });
      } else {
        const { _id, ...filteredTable } = tableData;
        const newTable = new Table({
          ...filteredTable,
          mapId: updatedMapData._id,
          restaurantId: req.userId,
          order: null,
          paid: true,
        });
        await newTable.save();
        map.tables.push(newTable._id);
      }
    }

    await map.save();

    const updatedMaps = await Map.find({ restaurantId: req.userId }).populate(
      "tables"
    );
    res.status(200).json(updatedMaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
