import Result from "../models/Result.js";
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
      answers = [],
      numberScore,
      diagnosis,
      tracingImageBase64 = ""
    } = req.body;

    if (typeof numberScore !== "number" || !diagnosis?.trim()) {
      return res.status(400).json({
        success: false,
        message: "numberScore and diagnosis are required."
      });
    }

    const createdResult = await Result.create({
      answers,
      numberScore,
      diagnosis: diagnosis.trim(),
      tracingImageBase64
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
    const results = await Result.find().sort({ date: -1 });

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

export const seedTestResult = async (_req, res) => {
  try {
    await Result.create({
      answers: [
        {
          plate: 1,
          answer: "12"
        },
        {
          plate: 2,
          answer: "8"
        }
      ],
      numberScore: 18,
      diagnosis: "Normal Color Vision"
    });

    return res.status(201).json({
      success: true,
      message: "Test document inserted"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to insert test document.",
      error: error.message
    });
  }
};

export const getDashboardStats = async (_req, res) => {
  try {
    const [stats] = await Result.aggregate([
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          normalVision: {
            $sum: {
              $cond: [{ $regexMatch: { input: "$diagnosis", regex: /normal color vision/i } }, 1, 0]
            }
          },
          protanopia: {
            $sum: {
              $cond: [{ $regexMatch: { input: "$diagnosis", regex: /protanopia/i } }, 1, 0]
            }
          },
          deuteranopia: {
            $sum: {
              $cond: [{ $regexMatch: { input: "$diagnosis", regex: /deuteranopia/i } }, 1, 0]
            }
          },
          borderline: {
            $sum: {
              $cond: [{ $regexMatch: { input: "$diagnosis", regex: /borderline|inconclusive/i } }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalTests: 1,
          normalVision: 1,
          protanopia: 1,
          deuteranopia: 1,
          borderline: 1
        }
      }
    ]);

    return res.status(200).json(
      stats || {
        totalTests: 0,
        normalVision: 0,
        protanopia: 0,
        deuteranopia: 0,
        borderline: 0
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
      error: error.message
    });
  }
};
