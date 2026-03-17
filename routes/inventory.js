var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventory');

// Lấy tất cả inventory
router.get('/', async function (req, res, next) {
    try {
        let result = await inventoryController.GetAllInventory();
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Lấy inventory theo ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await inventoryController.GetInventoryById(id);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                success: false,
                message: "Inventory không tồn tại"
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Tăng stock
router.post('/add-stock', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        if (!product || !quantity) {
            return res.status(400).send({
                success: false,
                message: "product và quantity không được rỗng"
            });
        }
        let result = await inventoryController.AddStock(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Giảm stock
router.post('/remove-stock', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        if (!product || !quantity) {
            return res.status(400).send({
                success: false,
                message: "product và quantity không được rỗng"
            });
        }
        let result = await inventoryController.RemoveStock(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Đặt hàng/Reservation
router.post('/reservation', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        if (!product || !quantity) {
            return res.status(400).send({
                success: false,
                message: "product và quantity không được rỗng"
            });
        }
        let result = await inventoryController.Reservation(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Bán hàng
router.post('/sold', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        if (!product || !quantity) {
            return res.status(400).send({
                success: false,
                message: "product và quantity không được rỗng"
            });
        }
        let result = await inventoryController.Sold(product, quantity);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
