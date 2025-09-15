import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({ message: "user doesn't have token" });
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res
                .status(401)
                .json({ message: "user doesn't have valid token" });
        }
        // console.log(verifyToken);
        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Invalid or expired token" });
    }
};

export default isAuth;
