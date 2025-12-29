export const adminProtect = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin only" });
        }
        next();
    } catch (err) {
        return res.status(403).json({ success: false });
    }
};  