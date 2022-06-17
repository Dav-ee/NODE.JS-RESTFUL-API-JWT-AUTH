const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require("../controllers/products");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Handle incoming requests from /orders

router.get("/", ProductsController.get_all_products);

router.get("/:productId", ProductsController.get_specific_product);

router.post("/", upload.single('productImage'), checkAuth, ProductsController.post_product);

router.patch("/:productId", checkAuth, ProductsController.update_product);

router.delete("/:productId", checkAuth, ProductsController.delete_product);

module.exports = router;