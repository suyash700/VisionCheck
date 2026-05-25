import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "visioncheck-admin-secret");

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required."
      });
    }

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found."
      });
    }

    req.admin = admin;
    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};

export default verifyAdmin;
