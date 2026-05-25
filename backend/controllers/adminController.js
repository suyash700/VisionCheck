import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Result from "../models/Result.js";
import {
  buildDashboardStats,
  buildExportCsv,
  buildResultFilters
} from "../services/adminService.js";

const signAdminToken = (admin) =>
  jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      username: admin.username
    },
    process.env.JWT_SECRET || "visioncheck-admin-secret",
    {
      expiresIn: "12h"
    }
  );

export const loginAdmin = async (req, res) => {
  try {
    const { username = "", password = "" } = req.body;

    if (!username.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required."
      });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    return res.status(200).json({
      success: true,
      token: signAdminToken(admin)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login admin.",
      error: error.message
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const filters = buildResultFilters(req.query);
    const results = await Result.find(filters).sort({ completedAt: -1 });
    const stats = buildDashboardStats(results);
    const recentResponses = results.slice(0, 8).map((item) => ({
      _id: item._id,
      date: item.completedAt,
      diagnosis: item.diagnosis,
      completionStatus: item.completionStatus
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...stats,
        recentResponses
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard.",
      error: error.message
    });
  }
};

export const getAdminResponses = async (req, res) => {
  try {
    const filters = buildResultFilters(req.query);
    const results = await Result.find(filters)
      .sort({ completedAt: -1 })
      .select("name age diagnosis completionStatus completedAt consent");

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin responses.",
      error: error.message
    });
  }
};

export const getAdminStatistics = async (req, res) => {
  try {
    const filters = buildResultFilters(req.query);
    const results = await Result.find(filters).sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      data: buildDashboardStats(results)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics.",
      error: error.message
    });
  }
};

export const exportAdminResponses = async (req, res) => {
  try {
    const filters = buildResultFilters(req.query);
    const results = await Result.find(filters).sort({ completedAt: -1 });
    const csv = buildExportCsv(results);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=visioncheck-export.csv");

    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export admin responses.",
      error: error.message
    });
  }
};
