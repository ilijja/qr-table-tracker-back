const Product = require("../models/Product");
const Menu = require("../models/Menu");
const MenuCategory = require("../models/MenuCategory");

exports.addProduct = (req, res, next) => {
  
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const categoryId = req.body.categoryId;

  const product = new Product({
    name: name,
    description: description,
    price: price,
    image: null,
    menuCategoryId: categoryId,
  });

  let addedProduct;

  product
    .save()
    .then((data) => {
      addedProduct = data;
      const category = MenuCategory.findById(categoryId);
      return category;
    })
    .then((category) => {
      category.products.push(addedProduct);
      return category.save();
    })
    .then((result) => {
      res.status(200).json(addedProduct);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addCategory = (req, res, next) => {
  const name = req.body.name;
  const menuId = req.body.menuId;

  const category = new MenuCategory({
    name: name,
    products: [],
    menuId: menuId,
  });

  let savedCategory;

  category
    .save()
    .then((data) => {
      savedCategory = data;
      return Menu.findById(data.menuId);
    })
    .then((menu) => {
      menu.categories.push(savedCategory);
      return menu.save();
    })
    .then((result) => {
      res.status(200).json(category);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addMenu = (req, res, next) => {
  const name = req.body.name;
  const restaurantId = req.userId;

  const menu = new Menu({
    name: name,
    restaurantId: restaurantId,
    categories: [],
  });

  menu
    .save()
    .then((data) => {
      res.status(200).json(data);
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, save) => {
  const productId = req.params.productId;

  let deletedProduct;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find product");
        error.status = 404;
        throw error;
      }

      return Product.findByIdAndDelete(product._id);
    })
    .then((product) => {
      deletedProduct = product;
      const category = MenuCategory.findById(product.menuCategoryId);
      if (!category) {
        const error = new Error("Could not find category");
        error.status = 404;
        throw error;
      }
      return category;
    })
    .then((category) => {
      const updatedProducts = category.products.filter((product) => {
        return product._id.toString() !== deletedProduct._id.toString();
      });
      category.products = updatedProducts;
      return category.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;

  Product.findById(productId)
    .then((product) => {
      product.name = name;
      product.description = description;
      product.price = price;

      return product.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;
  let deletedCategory;

  MenuCategory.findById(categoryId)
    .then((category) => {
      if (!category) {
        const error = new Error("Could not find category");
        error.status = 401;
        throw error;
      }

      deletedCategory = category;

      return MenuCategory.findByIdAndDelete(categoryId);
    })
    .then((result) => {
      return Product.deleteMany({ menuCategoryId: categoryId });
    })
    .then((result) => {
      return Menu.findById({ _id: deletedCategory.menuId.toString() });
    })
    .then((menu) => {
      const updatedCategories = menu.categories.filter((category) => {
        return category._id.toString() !== categoryId.toString();
      });

      menu.categories = updatedCategories;
      return menu.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;
  const name = req.body.name;

  MenuCategory.findById(categoryId)
    .then((category) => {
      category.name = name;
      return category.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMenus = (req, res, next) => {
  Menu.find({ restaurantId: req.userId })
    .populate({
      path: "categories",
      populate: {
        path: "products",
        model: "Product",
      },
    })
    .exec()
    .then((menus) => {
      res.status(200).json(menus);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getCategories = (req, res, next) => {
  const menuId = req.params.menuId;

  const userId = req.userId;

  Menu.findById(menuId)
    .populate("categories")
    .then((menu) => {
      if (menu.restaurantId.toString() !== userId) {
        const error = new Error("Not authorized");
        error.status = 401;
        throw error;
      }

      console.log(menu.categories);
      res.status(200).json(menu.categories);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.deleteMenu = (req, res, next) => {
  const menuId = req.params.id;

  Menu.findOne({ _id: menuId })
    .then((menu) => {
      return Menu.findByIdAndDelete(menu._id);
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
