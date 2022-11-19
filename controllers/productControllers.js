const model = require("../models/productModels");
const cloudinary = require("../middlewares/cloudinary");

// const getPageProduct = async (req, res) => {
//   try {
//     const { limit, page } = req.query;
//     const pageInt = +page;
//     const limitInt = +limit;

//     if (!pageInt && !limitInt) {
//       res.status(400).send("Bad request");
//     }
//     const products = await model.getAllProduct();
//     const totalPages = Math.ceil(products.rowCount / limitInt);
//     const isValidInput = pageInt <= totalPages && pageInt > 0;

//     if (!isValidInput) {
//       res.status(404).send("Data Not Found");
//     }

//     const offset = (pageInt - 1) * limitInt;
//     const getData = await model.productByPage(limitInt, offset);
//     const totalData = products.rowCount;
//     res.send({
//       data: getData.rows,
//       jumlahData: getData.rowCount,
//       currentPage: pageInt,
//       totalPages,
//       totalData,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ message: error.message });
//   }
// };

// const getNameProduct = async (req, res) => {
//   try {
//     const { name } = req.query;
//     const getData = await model.searchNameProduct(name);
//     res.send({
//       data: getData.rows,
//       jumlahData: getData.rowCount,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).send({ message: error.message });
//   }
// };

const getAllProduct = async (req, res) => {
  try {
    const getData = await model.getAllProduct();
    res.send({ data: getData.rows, jumlahData: getData.rowCount });
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
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
    const productCloud = await cloudinary.uploader.upload(req?.file?.path);
    const image = productCloud?.url;
    const checkProductName = await model.getProductByName(name);
    if (checkProductName.rowCount > 0) {
      return res.status(401).send("Duplicate Product Name");
    }
    if (buy_price) {
      if (isNaN(buy_price)) {
        return res.status(401).send("buy_price must be a Number");
      }
    }

    if (sell_price) {
      if (isNaN(sell_price)) {
        return res.status(401).send("sell_price must be a Number");
      }
    }

    if (stock) {
      if (isNaN(stock)) {
        return res.status(401).send("stock must be a Number");
      }
    }
    await model.createProduct({
      name,
      buy_price,
      sell_price,
      stock,
      image,
    });
    res.status(200).send({ message: "New Product Added Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, buyPrice, sellPrice, stock } = req.body;
    const getData = await model.getProductById(id);
    if (!getData?.rowCount) {
      return res.status(404).send("Data Not Found");
    }

    const checkProductName = await model.getProductByName(name);
    if (checkProductName.rowCount > 0) {
      return res.status(401).send("Duplicate Product Name");
    }

    if (buyPrice) {
      if (isNaN(buyPrice)) {
        return res.status(401).send("buy_price must be a Number");
      }
    }

    if (sellPrice) {
      if (isNaN(sellPrice)) {
        return res.status(401).send("sell_price must be a Number");
      }
    }

    if (stock) {
      if (isNaN(stock)) {
        return res.status(401).send("stock must be a Number");
      }
    }

    if (getData.rowCount > 0) {
      let inputName = name || getData.rows[0].name;
      let inputBuyPrice = buyPrice || getData.rows[0].buy_price;
      let inputSellPrice = sellPrice || getData.rows[0].sell_price;
      let inputStock = stock || getData.rows[0].stock;

      let message = "";

      if (name) message += "name,";
      if (buyPrice) message += "buy_price,";
      if (sellPrice) message += "sell_price,";
      if (stock) message += "stock,";

      await model.updateProduct({
        id,
        name: inputName,
        buy_price: inputBuyPrice,
        sell_price: inputSellPrice,
        stock: inputStock,
      });
      res.send(`${message} successfully changed`);
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

      await model.updateImageProduct({
        id: id,
        image: inputImage,
      });
      res.send(`${message} successfully changed`);
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

module.exports = {
  getAllProduct,
  getDetailProduct,
  createProduct,
  updateProduct,
  UpdateImageProduct,
  deleteProduct,
};
