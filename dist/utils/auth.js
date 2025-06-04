import jwt from "jsonwebtoken";
export const Auth = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).json({ error: "Error Token" });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded || typeof decoded !== "object" || !("id" in decoded)) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }
        const payLoad = decoded;
        req.userId = payLoad.id;
        next();
    });
};
