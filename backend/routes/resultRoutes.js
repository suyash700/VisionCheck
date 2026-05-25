import express from "express";
import {
  deleteResult,
  diagnoseResponses,
  getDashboardStats,
  getResultById,
  getResults,
  saveResults
} from "../controllers/resultController.js";

const router = express.Router();

router.post("/diagnose", diagnoseResponses);
router.post("/save-results", saveResults);
router.get("/results", getResults);
router.get("/results/:id", getResultById);
router.delete("/results/:id", deleteResult);
router.get("/dashboard/stats", getDashboardStats);

export default router;
