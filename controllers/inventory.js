let inventoryModel = require("../schemas/inventory");

module.exports = {
    // Lấy tất cả inventory (có join với product)
    GetAllInventory: async function () {
        try {
            return await inventoryModel.find().populate({
                path: 'product',
                select: 'title price description category'
            });
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    },

    // Lấy inventory theo ID (có join với product)
    GetInventoryById: async function (id) {
        try {
            return await inventoryModel.findById(id).populate({
                path: 'product',
                select: 'title price description category'
            });
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    },

    // Tạo inventory mới khi tạo product
    CreateInventory: async function (productId) {
        try {
            let newInventory = new inventoryModel({
                product: productId,
                stock: 0,
                reserved: 0,
                soldCount: 0
            });
            await newInventory.save();
            return newInventory;
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    },

    // Tăng stock
    AddStock: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                return {
                    success: false,
                    message: "Inventory không tồn tại"
                };
            }
            inventory.stock += quantity;
            await inventory.save();
            return {
                success: true,
                message: "Tăng stock thành công",
                data: inventory
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    },

    // Giảm stock
    RemoveStock: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                return {
                    success: false,
                    message: "Inventory không tồn tại"
                };
            }
            if (inventory.stock < quantity) {
                return {
                    success: false,
                    message: "Stock không đủ để giảm"
                };
            }
            inventory.stock -= quantity;
            await inventory.save();
            return {
                success: true,
                message: "Giảm stock thành công",
                data: inventory
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    },

    // Đặt hàng/Reservation: giảm stock, tăng reserved
    Reservation: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                return {
                    success: false,
                    message: "Inventory không tồn tại"
                };
            }
            if (inventory.stock < quantity) {
                return {
                    success: false,
                    message: "Stock không đủ để đặt hàng"
                };
            }
            inventory.stock -= quantity;
            inventory.reserved += quantity;
            await inventory.save();
            return {
                success: true,
                message: "Đơn đặt hàng được tạo thành công",
                data: inventory
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    },

    // Bán hàng: giảm reserved, tăng soldCount
    Sold: async function (productId, quantity) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                return {
                    success: false,
                    message: "Inventory không tồn tại"
                };
            }
            if (inventory.reserved < quantity) {
                return {
                    success: false,
                    message: "Reserved không đủ để bán hàng"
                };
            }
            inventory.reserved -= quantity;
            inventory.soldCount += quantity;
            await inventory.save();
            return {
                success: true,
                message: "Bán hàng thành công",
                data: inventory
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}
