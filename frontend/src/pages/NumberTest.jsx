import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import LoadingSpinner from "../components/LoadingSpinner";
import PlateCard from "../components/PlateCard";
import PlateTimer from "../components/PlateTimer";
import ProgressBar from "../components/ProgressBar";
import VirtualKeyboard from "../components/VirtualKeyboard";
import usePlateTimer from "../hooks/usePlateTimer";
import { useTestContext } from "../context/TestContext";
import { evaluateDiagnosis } from "../utils/diagnosis";
import { NUMBER_PLATES } from "../utils/plateCatalog";

const guidanceItems = [
  "Type using the physical keyboard or tap the virtual keyboard.",
  "Press Enter to submit the current answer.",
  "Use No Number when no visible number can be identified."
];

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-lg font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100";

const NumberTest = () => {
  const navigate = useNavigate();
  const {
    calibrationChecks,
    testState,
    setTestState,
    setSavedResult
  } = useTestContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const timeoutHandledRef = useRef(false);
  const inputRef = useRef(null);

  const currentPlate = NUMBER_PLATES[currentIndex];
  const totalPlates = NUMBER_PLATES.length;
  const isLastPlate = currentIndex === totalPlates - 1;

  const saveResponse = useCallback((answerValue, status = "answered") => {
    const answer = answerValue.trim() || "No Response";
    const nextResponse = {
      plate: currentPlate.id,
      answer,
      status
    };

    return [
      ...testState.answers.filter((response) => response.plate !== currentPlate.id),
      nextResponse
    ].sort((first, second) => first.plate - second.plate);
  }, [currentPlate.id, testState.answers]);

  const moveToPlate = useCallback((nextIndex) => {
    timeoutHandledRef.current = false;
    setCurrentIndex(nextIndex);
    setInputValue("");
    setError("");
  }, []);

  const finalizeNumberTest = useCallback(async (latestAnswers) => {
    try {
      setSubmitting(true);
      const diagnosisResult = evaluateDiagnosis(latestAnswers);

      setSavedResult(null);
      setTestState((current) => ({
        ...current,
        answers: latestAnswers,
        diagnosis: diagnosisResult.diagnosis,
        explanation: diagnosisResult.explanation,
        numberPlateScore: diagnosisResult.numberPlateScore,
        totalCorrectAnswers: diagnosisResult.totalCorrectAnswers,
        totalQuestions: diagnosisResult.totalQuestions,
        completedAt: diagnosisResult.completedAt
      }));
      navigate("/tracing-test");
    } catch (_error) {
      setError("Failed to evaluate the screening.");
    } finally {
      setSubmitting(false);
    }
  }, [navigate, setSavedResult, setTestState]);

  const handleAdvance = useCallback(async ({ forcedNoResponse = false } = {}) => {
    const answerValue = forcedNoResponse ? "No Response" : inputValue;

    if (!forcedNoResponse && !answerValue.trim()) {
      setError("Please enter or select a response before continuing.");
      return;
    }

    setError("");
    const latestAnswers = saveResponse(answerValue, forcedNoResponse ? "no-response" : "answered");
    setTestState((current) => ({
      ...current,
      answers: latestAnswers
    }));

    if (!isLastPlate) {
      moveToPlate(currentIndex + 1);
      return;
    }

    await finalizeNumberTest(latestAnswers);
  }, [currentIndex, finalizeNumberTest, inputValue, isLastPlate, moveToPlate, saveResponse, setTestState]);

  const handleTimeout = useCallback(async () => {
    if (timeoutHandledRef.current) {
      return;
    }

    timeoutHandledRef.current = true;
    await handleAdvance({ forcedNoResponse: true });
  }, [handleAdvance]);

  const handlePrevious = useCallback(() => {
    if (currentIndex === 0) {
      return;
    }

    if (inputValue.trim()) {
      const latestAnswers = saveResponse(inputValue, "answered");
      setTestState((current) => ({
        ...current,
        answers: latestAnswers
      }));
    }

    moveToPlate(currentIndex - 1);
  }, [currentIndex, inputValue, moveToPlate, saveResponse, setTestState]);

  const existingResponse = useMemo(
    () => testState.answers.find((response) => response.plate === currentPlate.id),
    [currentPlate.id, testState.answers]
  );

  const timer = usePlateTimer({
    plateKey: currentPlate.id,
    onExpire: handleTimeout
  });

  const handleAppend = useCallback((token) => {
    setError("");
    setInputValue((current) => {
      if (token === "none") {
        return "none";
      }
      if (current === "none") {
        return token;
      }
      return `${current}${token}`;
    });
    inputRef.current?.focus();
  }, []);

  const handleBackspace = useCallback(() => {
    setInputValue((current) => current.slice(0, -1));
    setError("");
    inputRef.current?.focus();
  }, []);

  const handleClear = useCallback(() => {
    setInputValue("");
    setError("");
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentPlate.id]);

  if (!Object.values(calibrationChecks).every(Boolean)) {
    return <Navigate to="/calibration" replace />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[0.76fr_0.24fr]">
        <section className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <ProgressBar current={currentIndex + 1} total={totalPlates} label={`Plate ${currentPlate.id}`} />
            <PlateTimer secondsLeft={timer.secondsLeft} progress={timer.progress} />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.32fr_0.68fr]">
            <PlateCard
              plate={currentPlate}
              title="What number do you see?"
              subtitle="Keep your focus on the plate, then answer using the keyboard or the virtual keypad."
              compact
            />

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-panel">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Response
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-ink">
                      Plate {currentPlate.id} answer
                    </h2>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    {existingResponse ? "Saved earlier" : "Ready"}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="plate-response" className="mb-2 block text-sm font-semibold text-slate-700">
                    Answer field
                  </label>
                  <input
                    id="plate-response"
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(event) => {
                      setInputValue(event.target.value);
                      setError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleAdvance();
                      }
                    }}
                    placeholder="Enter visible number"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
                {submitting ? (
                  <div className="mt-4">
                    <LoadingSpinner label="Applying rule-based diagnosis..." />
                  </div>
                ) : null}

                <div className="mt-5">
                  <VirtualKeyboard
                    value={inputValue}
                    onAppend={handleAppend}
                    onBackspace={handleBackspace}
                    onClear={handleClear}
                    onSubmit={() => void handleAdvance()}
                    disabled={submitting}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleAdvance()}
                    disabled={submitting}
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {submitting ? "Evaluating..." : isLastPlate ? "Finish Number Test" : "Save and Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <InfoCard
            eyebrow="Current Session"
            title="Number Plate Assessment"
            description={`Plate ${currentIndex + 1} of ${totalPlates}. New plates always open with a cleared answer field.`}
            tone="highlight"
          />

          <InfoCard
            eyebrow="Progress"
            title="Session Summary"
            description={`Saved answers: ${testState.answers.length}`}
          >
            <div className="space-y-2 text-sm text-slate-600">
              <p>Current stage: Number plate screening</p>
              <p>Automatic no-response capture is enabled when the timer ends.</p>
            </div>
          </InfoCard>

          <InfoCard eyebrow="Guidance" title="Response Tips" tone="soft">
            <div className="space-y-2 text-sm text-slate-600">
              {guidanceItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </InfoCard>
        </aside>
      </div>
    </main>
  );
};

export default NumberTest;
