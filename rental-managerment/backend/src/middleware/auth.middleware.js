const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    try {
        const tokenRaw = req.headers.authorization;
        if (!tokenRaw || !tokenRaw.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access Denied. Vui lòng đăng nhập!" });
        }
        const token = tokenRaw.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
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
