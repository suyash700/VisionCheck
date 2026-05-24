import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PlateCard from "../components/PlateCard";
import ProgressBar from "../components/ProgressBar";
import LoadingSpinner from "../components/LoadingSpinner";
import clinicalRules from "../data/clinicalRules.json";
import { useTestContext } from "../context/TestContext";
import { evaluateDiagnosis } from "../utils/diagnosis";

const plates = clinicalRules.plates;

const NumberTest = () => {
  const navigate = useNavigate();
  const { calibrationChecks, testState, setTestState, setSavedResult, setTracingSubmissions } = useTestContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState(testState.answers[currentIndex]?.answer || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentPlate = plates[currentIndex];
  const totalPlates = plates.length;
  const isLastPlate = currentIndex === totalPlates - 1;
  const currentProgress = currentIndex + 1;

  const existingResponse = useMemo(
    () => testState.answers.find((response) => response.plate === currentPlate.plate),
    [testState.answers, currentPlate.plate]
  );

  const saveResponse = () => {
    const sanitizedAnswer = inputValue.trim();
    const nextResponse = {
      plate: currentPlate.plate,
      answer: sanitizedAnswer
    };

    setTestState((current) => {
      const filtered = current.answers.filter((response) => response.plate !== currentPlate.plate);
      return {
        ...current,
        answers: [...filtered, nextResponse].sort((a, b) => a.plate - b.plate)
      };
    });
  };

  const handleNext = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a response before continuing.");
      return;
    }

    setError("");
    saveResponse();

    if (!isLastPlate) {
      const nextIndex = currentIndex + 1;
      const nextPlateNumber = plates[nextIndex].plate;
      const nextExisting = testState.answers.find((response) => response.plate === nextPlateNumber);

      setCurrentIndex(nextIndex);
      setInputValue(nextExisting?.answer || "");
      return;
    }

    try {
      setSubmitting(true);

      const latestResponses = [
        ...testState.answers.filter((response) => response.plate !== currentPlate.plate),
        { plate: currentPlate.plate, answer: inputValue.trim() }
      ].sort((a, b) => a.plate - b.plate);

      const response = evaluateDiagnosis(latestResponses);

      setTracingSubmissions([]);
      setSavedResult(null);
      setTestState({
        answers: latestResponses,
        numberScore: response.numberScore,
        diagnosis: response.diagnosis,
        tracingImageBase64: "",
        explanation: response.explanation,
        totalCorrectAnswers: response.totalCorrectAnswers,
        totalQuestions: response.totalQuestions,
        date: response.date
      });
      navigate("/tracing-test");
    } catch (_apiError) {
      setError("Failed to evaluate the screening.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    saveResponse();
    if (currentIndex === 0) {
      return;
    }

    const previousIndex = currentIndex - 1;
    const previousPlateNumber = plates[previousIndex].plate;
    const previousResponse = testState.answers.find((response) => response.plate === previousPlateNumber);

    setCurrentIndex(previousIndex);
    setInputValue(previousResponse?.answer || "");
    setError("");
  };

  if (!Object.values(calibrationChecks).every(Boolean)) {
    return <Navigate to="/calibration" replace />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
        <div className="space-y-6">
          <ProgressBar current={currentProgress} total={totalPlates} label={`Plate ${currentPlate.plate} of ${totalPlates}`} />

          <PlateCard
            plate={currentPlate}
            title="What number do you see?"
            subtitle={currentPlate.prompt}
          />

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Plate {currentPlate.plate} response
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={currentPlate.type === "classification" ? "Example: 6/26" : "Enter the visible number"}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
            />
            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
            {submitting ? <div className="mt-4"><LoadingSpinner label="Applying rule-based diagnosis..." /></div> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? "Evaluating..." : isLastPlate ? "Finish Number Test" : "Next"}
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
            <h2 className="text-lg font-semibold text-ink">Test Progress</h2>
            <p className="mt-2 text-sm text-slate-600">Saved answers: {testState.answers.length}{existingResponse ? " + current draft" : ""}</p>
            <p className="mt-1 text-sm text-slate-600">Current stage: Number plate screening</p>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-6 shadow-panel">
            <h2 className="text-lg font-semibold text-ink">Input Guidance</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Type `none` for plates 18-21 when no number is visible.</p>
              <p>For plates 22-25, if both numbers are visible, enter the clearer number first.</p>
              <p>Examples: `6`, `2`, `6/26`, `4/42`.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default NumberTest;
