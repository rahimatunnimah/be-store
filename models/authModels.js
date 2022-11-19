const db = require("../config/db");

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
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

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
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

const registerUser = (user) => {
  const { username, email, password } = user;
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [username, email, password],
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

module.exports = {
  getUserByUsername,
  getUserByEmail,
  registerUser,
};
