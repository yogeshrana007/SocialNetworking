import jwt from "jsonwebtoken";

// Helper to extract token from cookie or Authorization header
function getToken(req) {
    const cookieToken = req.cookies?.token; // requires cookie-parser [2]
    const auth = req.headers.authorization || "";
    const headerToken = auth.startsWith("Bearer ") ? auth.slice(7) : null; // 401 semantics [6]
    return cookieToken || headerToken || null;
}

const isAuth = (req, res, next) => {
    try {
        const token = getToken(req);
        if (!token) {
            return res
                .status(401)
                .json({ message: "Missing authentication token" }); // 401 for missing creds [6]
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // may throw [13]
        req.userId = decoded.userId;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" }); // expired credentials -> 401 [13][6]
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" }); // malformed/invalid -> 401 [13][18]
        }
        return res
            .status(500)
            .json({ message: "Authentication processing error" }); // unexpected
    }
};

export default isAuth;
