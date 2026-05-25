import Result from "../models/Result.js";
import { buildDashboardStats, buildResultFilters } from "../services/adminService.js";
import { evaluateDiagnosis } from "../services/diagnosisService.js";

export const diagnoseResponses = async (req, res) => {
  try {
    const { patientId, responses } = req.body;

    if (!patientId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required."
      });
    }

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one plate response is required."
      });
    }

    const diagnosisResult = evaluateDiagnosis(responses);

    return res.status(200).json({
      success: true,
      patientId,
      ...diagnosisResult
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate diagnosis.",
      error: error.message
    });
  }
};

export const saveResults = async (req, res) => {
  try {
    const {
      name = "",
      age = "",
      diagnosis,
      numberPlateScore,
      tracingPlateScore,
      noResponseCount,
      totalCorrectAnswers = 0,
      totalQuestions = 25,
      completedAt,
      consent = true,
      completionStatus = "completed",
      responses = {}
    } = req.body;

    if (
      !diagnosis?.trim() ||
      typeof numberPlateScore !== "number" ||
      typeof tracingPlateScore !== "number" ||
      typeof noResponseCount !== "number" ||
      !completedAt
    ) {
      return res.status(400).json({
        success: false,
        message: "diagnosis, numberPlateScore, tracingPlateScore, noResponseCount, and completedAt are required."
      });
    }

    const createdResult = await Result.create({
      name: name.trim(),
      age: `${age}`.trim(),
      diagnosis: diagnosis.trim(),
      numberPlateScore,
      tracingPlateScore,
      noResponseCount,
      totalCorrectAnswers,
      totalQuestions,
      completedAt,
      consent: Boolean(consent),
      completionStatus,
      responses: {
        number: Array.isArray(responses.number) ? responses.number : [],
        tracing: Array.isArray(responses.tracing) ? responses.tracing : []
      }
    });

    return res.status(201).json({
      success: true,
      message: "Results saved successfully",
      data: createdResult
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save results.",
      error: error.message
    });
  }
};

export const getResults = async (req, res) => {
  try {
    const results = await Result.find(buildResultFilters(req.query)).sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch results.",
      error: error.message
    });
  }
};

export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch result.",
      error: error.message
    });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const deletedResult = await Result.findByIdAndDelete(req.params.id);

    if (!deletedResult) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete result.",
      error: error.message
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const results = await Result.find(buildResultFilters(req.query)).sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      data: buildDashboardStats(results)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
      error: error.message
    });
  }
};
