export const adminOnly = (req, res, next) => {
    if (req.auth?.sessionClaims?.role !== "admin") {
        return res.status(403).json({ message: "Admins only" });
    }
    next();
};
