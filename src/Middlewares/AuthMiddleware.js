const jwt = require("jsonwebtoken");
const secret = require("../Config/secret");

module.exports = function auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if(!token) {
            return res.status(401).json({
                status: "error",
                message: "Token does't exist"
            });
        } else {
            const decoded = jwt.verify(token, secret.JWT);
            req.userData = { _id: decoded._id, username: decoded.username, password: decoded.password };
            next();
        }
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Auth failed",
            details: error.message
        });
    }
};