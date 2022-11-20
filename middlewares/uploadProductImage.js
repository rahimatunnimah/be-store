const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}_${Math.random()}_${uuidv4()}_${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000, // 100 KB
  },
  fileFilter: (req, file, cb) => {
    // const filetypes = /jpg|png/;
    const extname = path.extname(file.originalname).toLowerCase();
    // const mimetype = filetypes.test(file.mimetype);

    if (extname !== ".jpg" && extname !== ".png") {
      cb(new Error("Only accept png and jpg!"), false);
      return;
    }
    cb(null, true);
  },
});

const uploadProductImage = (req, res, next) => {
  const uploadSingle = upload.single("image");
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      next();
    }
  });
};

module.exports = uploadProductImage;
