const model = require("../models/authModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(15);
    const hash = bcrypt.hashSync(password, salt);
    const checkUsername = await model.getUserByUsername(username);
    const checkEmail = await model.getUserByEmail(email);

    const fieldIsBlank = !username || !email || !password;

    if (fieldIsBlank) {
      res.status(422).send("Do not leave anything blank");
    } else if (checkUsername.rowCount > 0) {
      res.status(401).send("Duplicate username");
    } else if (checkEmail.rowCount > 0) {
      res.status(401).send("Duplicate email");
    } else {
      await model.registerUser({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hash,
      });
      res.status(200).send({ message: "Register user success!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      return res.status(400).send(`Email and password is required!`);
    }

    const getDataUser = await model.getUserByEmail(email);
    const resultUser = getDataUser?.rows[0];

    if (getDataUser?.rowCount) {
      const checkPasswrod = bcrypt.compareSync(password, resultUser.password);

      if (checkPasswrod) {
        const token = jwt.sign(resultUser, process.env.PRIVATE_KEY, {
          expiresIn: "24h",
        });

        res.status(200).send({
          message: "Login successfully",
          data: { ...resultUser, password: null },
          token,
        });
      } else {
        res.status(401).send("invalid password");
      }
    } else {
      res.status(400).send("user not register");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

module.exports = { login, register };
