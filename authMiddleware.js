exports.authMiddleware = (req, res, next) => {
    console.log("Middleware called"); // Confirm the middleware is being executed
    
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies.token;

    if (!token) {
        console.log("No token provided in Authorization header or cookies");
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("User decoded from token:", decoded);
        next();
    } catch (error) {
        console.log("JWT verification failed:", error.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
