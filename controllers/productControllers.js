const model = require("../models/productModels");
const cloudinary = require("../middlewares/cloudinary");

const readProduct = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const pageInt = +page;
    const limitInt = +limit;

    if (!pageInt && !limitInt) {
      res.status(400).send("Bad request");
    }
    const products = await model.getAllProduct();
    const totalPages = Math.ceil(products.rowCount / limitInt);
    const isValidInput = pageInt <= totalPages && pageInt > 0;

    if (!isValidInput) {
      res.status(404).send("Data Not Found");
    }

    const offset = (pageInt - 1) * limitInt;
    const getData = await model.productByPage(limitInt, offset);
    const totalData = products.rowCount;
    res.send({
      data: getData.rows,
      jumlahData: getData.rowCount,
      page: pageInt,
      totalPages,
      totalData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const getData = await model.getProductById(id);

    if (getData.rows.length === 0) {
      res.status(400).send("Data not found");
    } else {
      res.send({
        data: getData.rows,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, buy_price, sell_price, stock } = req.body;
    const recipeCloud = await cloudinary.uploader.upload(req?.file?.path);
    const image = recipeCloud?.url;
    const addProduct = await model.createProduct({
      name,
      buy_price,
      sell_price,
      stock,
      image,
    });

    if (addProduct) {
      res.send({
        message: "data added successfully",
        data: {
          name: name.trim(),
          buy_price,
          sell_price,
          stock,
          image,
        },
      });
    } else {
      res.status(400).send("data failed to add");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, buy_price, sell_price, stock } = req.body;

    const getData = await model.getProductById(id);

    if (getData.rowCount > 0) {
      let inputName = name || getData.rows[0].name;
      let inputBuyPrice = buy_price || getData.rows[0].buy_price;
      let inputSellPrice = sell_price || getData.rows[0].sell_price;
      let inputStock = stock || getData.rows[0].stock;

      let message = "";

      if (name) message += "name,";
      if (buy_price) message += "buy_price,";
      if (sell_price) message += "sell_price,";
      if (stock) message += "stock,";

      const editData = await model.updateProduct({
        name: inputName,
        buy_price: inputBuyPrice,
        sell_price: inputSellPrice,
        stock: inputStock,
      });
      if (editData) {
        res.send(`${message} successfully changed`);
      } else {
        res.status(400).send("data failed to change");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const UpdateImageProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const profileCloud = await cloudinary.uploader.upload(req?.file?.path);
    const image = profileCloud?.url;
    const getData = await model.getProductById(id);

    if (getData.rowCount > 0) {
      let inputImage = image || getData.rows[0].image;
      let message = "";

      if (image) message += "image,";

      const editData = await model.updateImageProduct({
        image: inputImage,
      });
      if (editData) {
        res.send(`${message} successfully changed`);
      } else {
        res.status(400).send("data failed to change");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await model.getProductById(id);

    if (getData.rowCount > 0) {
      const deleteProduct = await model.deleteProduct(id);
      if (deleteProduct) {
        res.send(`data id ${id} successfully deleted`);
      } else {
        res.status(400).send("data failed to delete");
      }
    } else {
      res.status(400).send("data not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const searchNameProduct = async (req, res) => {
  try {
    const { name } = req.query;
    const { page, limit } = req.query;
    if (name === "") {
      const getAll = await model.getAllProduct(page, limit);
      res.send({
        data: getAll.rows,
        jumlahData: getAll.rowCount,
      });
    } else {
      const getData = await model.searchNameProduct(name);
      res.send({
        data: getData.rows,
        jumlahData: getData.rowCount,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  readProduct,
  getDetailProduct,
  createProduct,
  updateProduct,
  UpdateImageProduct,
  deleteProduct,
  searchNameProduct,
};
