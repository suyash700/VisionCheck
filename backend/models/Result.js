import mongoose from "mongoose";

const NumberResponseSchema = new mongoose.Schema(
  {
    plate: {
      type: Number,
      required: true
    },
    answer: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "answered"
    }
  },
  { _id: false }
);

const TracingResponseSchema = new mongoose.Schema(
  {
    plateId: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "correct"
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    matchedCount: {
      type: Number,
      default: 0
    },
    checkpointCount: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const ResultSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true
    },
    age: {
      type: String,
      default: "",
      trim: true
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    numberPlateScore: {
      type: Number,
      required: true
    },
    tracingPlateScore: {
      type: Number,
      required: true
    },
    noResponseCount: {
      type: Number,
      required: true
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 25
    },
    completionStatus: {
      type: String,
      enum: ["completed", "incomplete"],
      default: "completed",
      index: true
    },
    consent: {
      type: Boolean,
      default: true
    },
    responses: {
      number: {
        type: [NumberResponseSchema],
        default: []
      },
      tracing: {
        type: [TracingResponseSchema],
        default: []
      }
    },
    completedAt: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

ResultSchema.index({
  name: "text",
  diagnosis: "text"
});

export default mongoose.model("Result", ResultSchema);
