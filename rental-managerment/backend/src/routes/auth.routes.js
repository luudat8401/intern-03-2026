const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const User = require("../models/User");
const Master = require("../models/Master");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
    try {
        const { username, password, role, name, phone, email, address } = req.body;

        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let userId = null;
        let masterId = null;

        if (role === "master") {
            const master = new Master({
                name: name || username,
                phone: phone || "0000000000",
                email: email || "temp@mail.com",
                address: address || "Chưa cập nhật"
            });
            await master.save();
            masterId = master._id;
        } else if (role === "user") {
            const user = new User({
                name: name || username,
                phone: phone || "0000000000",
            });
            await user.save();
            userId = user._id;
        }
        const account = new Account({
            username,
            password: hashedPassword,
            role,
            userId,
            masterId
        });
        await account.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const account = await Account.findOne({ username })
            .populate('userId', 'name')
            .populate('masterId', 'name');

        if (!account) {
            return res.status(404).json({ error: "Tài khoản không tồn tại" });
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Mật khẩu không chính xác" });
        }

        const profileId = account.role === 'master' ? account.masterId?._id : account.userId?._id;
        const profileName = account.role === 'master' && account.masterId ? account.masterId.name :
            (account.role === 'user' && account.userId ? account.userId.name : account.username);

        const token = jwt.sign(
            {
                id: account._id,
                role: account.role,
                profileId: profileId
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.json({
            message: "Đăng nhập thành công",
            token: token,
            role: account.role,
            username: account.username,
            name: profileName,
            profileId: profileId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
