let userModel = require("../schemas/users");
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs')

// Load RSA keys
const privateKey = fs.readFileSync('./private.key', 'utf8');
const publicKey = fs.readFileSync('./public.key', 'utf8');

module.exports = {
    CreateAnUser: async function (username, password, email, role, fullName, avatarUrl, status, loginCount) {
        let newItem = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save();
        return newItem;
    },
    GetAllUser: async function () {
        return await userModel
            .find({ isDeleted: false })
    },
    GetUserById: async function (id) {
        try {
            return await userModel
                .find({
                    isDeleted: false,
                    _id: id
                })
        } catch (error) {
            return false;
        }
    },
    QueryLogin: async function (username, password) {
        if (!username || !password) {
            return false;
        }
        let user = await userModel.findOne({
            username: username,
            isDeleted: false
        })
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                return jwt.sign({
                    id: user.id
                }, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: '1d'
                })
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    ChangePassword: async function (userId, oldPassword, newPassword) {
        try {
            // Tìm user theo ID
            let user = await userModel.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: "User khong ton tai"
                };
            }
            
            // Kiểm tra oldPassword có đúng không
            if (!bcrypt.compareSync(oldPassword, user.password)) {
                return {
                    success: false,
                    message: "Mat khau cu khong chinh xac"
                };
            }
            
            // Cập nhật password mới
            user.password = newPassword;
            await user.save();
            
            return {
                success: true,
                message: "Thay doi mat khau thanh cong"
            };
        } catch (error) {
            return {
                success: false,
                message: "Co loi xay ra: " + error.message
            };
        }
    }
}