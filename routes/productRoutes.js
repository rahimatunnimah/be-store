const Router = require("express").Router();
const controller = require("../controllers/productControllers");
const middlewares = require("../middlewares/jwt");
const uploadImage = require("../middlewares/uploadProductImage");

Router.get("/", controller.getAllProduct)
  .get("/detail/:id", controller.getDetailProduct)
  .post("/add", middlewares.checkToken, uploadImage, controller.createProduct)
  .patch("/edit/:id", middlewares.checkToken, controller.updateProduct)
  .patch(
    "/edit/photo/:id",
    middlewares.checkToken,
    uploadImage,
    controller.UpdateImageProduct
  )
  .delete("/delete/:id", middlewares.checkToken, controller.deleteProduct);

module.exports = Router;
