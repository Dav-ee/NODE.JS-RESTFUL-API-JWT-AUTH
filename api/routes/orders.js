const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require("../controllers/orders");

// Handle incoming requests from /orders

router.get("/", checkAuth, OrdersController.get_All_orders);

router.get("/:orderId", checkAuth, OrdersController.get_Specific_Orders);

router.delete("/:orderId", checkAuth, OrdersController.delete_Order);

router.post("/", checkAuth, OrdersController.create_order);

module.exports = router;
