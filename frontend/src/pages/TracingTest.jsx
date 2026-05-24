import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CanvasTracer from "../components/CanvasTracer";
import LoadingSpinner from "../components/LoadingSpinner";
import PlateCard from "../components/PlateCard";
import ProgressBar from "../components/ProgressBar";
import clinicalRules from "../data/clinicalRules.json";
import { useTestContext } from "../context/TestContext";
import { saveResults } from "../services/api";

const tracingPlates = clinicalRules.tracingPlates;

const TracingTest = () => {
  const navigate = useNavigate();
  const {
    testState,
    tracingSubmissions,
    setTracingSubmissions,
    setTestState,
    setSavedResult
  } = useTestContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentPlate = tracingPlates[currentIndex];
  const isLastPlate = currentIndex === tracingPlates.length - 1;

  const handleTraceSubmit = (imageBase64) => {
    setTracingSubmissions((current) => {
      const filtered = current.filter((item) => item.plate !== currentPlate.plate);
      return [...filtered, { plate: currentPlate.plate, imageBase64 }].sort((a, b) => a.plate - b.plate);
    });

    if (!isLastPlate) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    finalizeResult([
      ...tracingSubmissions.filter((item) => item.plate !== currentPlate.plate),
      { plate: currentPlate.plate, imageBase64 }
    ]);
  };

  const finalizeResult = async (latestSubmissions) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const tracingImageBase64 = JSON.stringify(latestSubmissions);
      setTestState((current) => ({
        ...current,
        tracingImageBase64
      }));

      const response = await saveResults({
        answers: testState.answers,
        numberScore: testState.numberScore,
        diagnosis: testState.diagnosis,
        tracingImageBase64
      });

      setSavedResult(response.data);
      setSuccessMessage("Results stored successfully in MongoDB Atlas.");
      navigate("/result");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to save results.");
    } finally {
      setSaving(false);
    }
  };

  const handleSkipRemaining = async () => {
    await finalizeResult(tracingSubmissions);
  };

  if (!testState.diagnosis) {
    return <Navigate to="/calibration" replace />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
        <div className="space-y-6">
          <ProgressBar
            current={currentIndex + 1}
            total={tracingPlates.length}
            label={`Tracing plate ${currentPlate.plate} of ${tracingPlates[tracingPlates.length - 1].plate}`}
          />

          <PlateCard
            plate={currentPlate}
            title="Tracing Plate Review"
            subtitle={currentPlate.prompt}
          />

          <CanvasTracer onSubmit={handleTraceSubmit} helperText={`Plate ${currentPlate.plate}: trace the visible path, then submit to move to the next tracing plate.`} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
            <h2 className="text-lg font-semibold text-ink">Tracing Progress</h2>
            <p className="mt-3 text-sm text-slate-600">Diagnosis: {testState.diagnosis}</p>
            <p className="mt-1 text-sm text-slate-600">Saved traces: {tracingSubmissions.length} / {tracingPlates.length}</p>
            <p className="mt-1 text-sm text-slate-600">Answers captured: {testState.answers?.length || 0} / 25</p>
          </div>

          <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-6 shadow-panel">
            <h2 className="text-lg font-semibold text-ink">Physician Note</h2>
            <p className="mt-3 text-sm text-slate-600">
              Tracing plates are stored exactly as drawn and are never auto-graded. They remain available only for physician review in the admin dashboard.
            </p>
          </div>

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {successMessage ? <p className="text-sm text-success">{successMessage}</p> : null}
          {saving ? <LoadingSpinner label="Saving final screening result..." /> : null}

          <button
            type="button"
            onClick={handleSkipRemaining}
            disabled={saving}
            className="w-full rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {saving ? "Saving..." : "Save Current Result"}
          </button>
        </aside>
      </div>
    </main>
  );
};

export default TracingTest;
