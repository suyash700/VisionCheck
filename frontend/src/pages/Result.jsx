import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import AssessmentSummary from "../components/AssessmentSummary";
import ResultCard from "../components/ResultCard";
import { useTestContext } from "../context/TestContext";
import { saveResults } from "../services/api";

const buildExportPayload = (testState, savedResult) => ({
  patientName: testState.participantName,
  age: testState.participantAge,
  completedAt: savedResult?.completedAt || testState.completedAt,
  diagnosis: testState.diagnosis,
  numberPlateScore: testState.numberPlateScore,
  tracingPlateScore: testState.tracingPlateScore,
  noResponseCount: testState.noResponseCount,
  explanation: testState.explanation
});

const Result = () => {
  const { testState, savedResult, setSavedResult, resetTestState } = useTestContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!testState.diagnosis) {
    return <Navigate to="/patient-info" replace />;
  }

  const resultView = useMemo(
    () => ({
      ...testState,
      ...savedResult,
      dateLabel: new Date(savedResult?.completedAt || testState.completedAt).toLocaleString(),
      clinicalExplanation: testState.explanation
    }),
    [savedResult, testState]
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const response = await saveResults({
        name: testState.participantName || "",
        age: testState.participantAge || "",
        diagnosis: testState.diagnosis,
        numberPlateScore: testState.numberPlateScore,
        tracingPlateScore: testState.tracingPlateScore,
        noResponseCount: testState.noResponseCount,
        totalCorrectAnswers: testState.totalCorrectAnswers,
        totalQuestions: testState.totalQuestions,
        completedAt: testState.completedAt || new Date().toISOString(),
        completionStatus: "completed",
        consent: true,
        responses: {
          number: testState.answers,
          tracing: testState.tracingResponses
        }
      });
      setSavedResult(response.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to save results.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const payload = buildExportPayload(testState, savedResult);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `visioncheck-report-${Date.now()}.json`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <ResultCard result={resultView} />
        <AssessmentSummary testState={testState} savedResult={savedResult} />

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
          <h2 className="text-xl font-semibold text-ink">Clinical Explanation</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Reason</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{testState.explanation}</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Privacy</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Camera data is processed locally only. No images, video, face data, or trace drawings are stored.
              </p>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
          {savedResult?._id ? <p className="mt-4 text-sm text-success">Assessment saved successfully.</p> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || Boolean(savedResult?._id)}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? "Saving..." : savedResult?._id ? "Saved" : "Save Assessment"}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Export
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Print
            </button>
            <Link
              to="/patient-info"
              onClick={resetTestState}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Start New Screening
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default Result;
