import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    plate: {
      type: Number,
      required: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false
  }
);

const ResultSchema = new mongoose.Schema({
  answers: {
    type: [AnswerSchema],
    default: []
  },
  numberScore: {
    type: Number,
    required: true
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  tracingImageBase64: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Result", ResultSchema);
