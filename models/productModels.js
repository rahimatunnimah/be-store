const db = require("../config/db");

const getAllProduct = () => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM products ORDER BY id DESC`, [], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM products WHERE id = $1`, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const createProduct = (props) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO products (name, image, buy_price, sell_price, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [props.name, props.image, props.buy_price, props.sell_price, props.stock],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const updateProduct = (props) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE products SET name = $1, buy_price = $2, sell_price = $3, stock = $4 WHERE id = $5`,
      [props.name, props.buy_price, props.sell_price, props.stock, props.id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const updateImageProduct = (props) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE products SET image = $1 WHERE id = $2`,
      [props.image, props.id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM products WHERE id = $1`, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const searchNameProduct = (name) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM products WHERE LOWER (name) LIKE $1 ORDER BY name ASC`,
      [`%${name}%`],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const productByPage = (limit, page) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM products ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, page],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

module.exports = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  updateImageProduct,
  deleteProduct,
  searchNameProduct,
  productByPage,
};
