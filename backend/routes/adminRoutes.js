import express from "express";
import {
  exportAdminResponses,
  getAdminDashboard,
  getAdminResponses,
  getAdminStatistics,
  loginAdmin
} from "../controllers/adminController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/dashboard", verifyAdmin, getAdminDashboard);
router.get("/responses", verifyAdmin, getAdminResponses);
router.get("/statistics", verifyAdmin, getAdminStatistics);
router.get("/export", verifyAdmin, exportAdminResponses);

export default router;
