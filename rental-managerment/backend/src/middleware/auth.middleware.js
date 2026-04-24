const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    try {
        console.log("start")
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: "Access Denied. Vui lòng đăng nhập!" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const role = decoded.role
        const id = decoded.id

        const accountRepo = AppDataSource.getRepository("Account");
        const currentAccount = await accountRepo.findOne({
            where :{id,role}
        })
        if (!currentAccount) {
            res.clearCookie("token"); // Bắt buộc: Lệnh cho trình duyệt xóa luôn token cũ
            return res.status(401).json({ error: "Tài khoản của bạn không tồn tại hoặc đã bị xóa!" });
        }
        req.user = decoded;
        console.log("end")
        next();
    } catch (err) {
        return res.status(403).json({ error: "Thẻ (Token) không hợp lệ hoặc đã hết hạn!" });
    }
};
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Bạn không có quyền truy cập vào khu vực này!" });
        }
        next();
    };
};
module.exports = {
    verifyToken,
    checkRole
};
