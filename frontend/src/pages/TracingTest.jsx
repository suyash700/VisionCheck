import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import PageHero from "../components/PageHero";
import PlateTimer from "../components/PlateTimer";
import ProgressBar from "../components/ProgressBar";
import TraceCanvas from "../components/TraceCanvas";
import usePlateTimer from "../hooks/usePlateTimer";
import { useTestContext } from "../context/TestContext";
import { TRACING_PLATES } from "../utils/plateCatalog";

const tracingGuidance = [
  "Trace the path directly over the visible line.",
  "Use Clear if you want to restart before submitting.",
  "Canvas data is checked in-browser and not stored as an image."
];

const TracingTest = () => {
  const navigate = useNavigate();
  const { testState, setTestState } = useTestContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const timeoutHandledRef = useRef(false);

  const currentPlate = TRACING_PLATES[currentIndex];
  const isLastPlate = currentIndex === TRACING_PLATES.length - 1;

  const finalize = (latestTracingResponses) => {
    const noResponseCount =
      testState.answers.filter((response) => response.status === "no-response").length +
      latestTracingResponses.filter((response) => response.status === "no-response").length;

    const tracingPlateScore = latestTracingResponses.filter((response) => response.isCorrect).length;

    setTestState((current) => ({
      ...current,
      tracingResponses: latestTracingResponses,
      tracingPlateScore,
      noResponseCount,
      completedAt: current.completedAt || new Date().toISOString()
    }));

    navigate("/result");
  };

  const advance = (result) => {
    const latestTracingResponses = [
      ...testState.tracingResponses.filter((response) => response.plateId !== currentPlate.id),
      result
    ].sort((first, second) => first.plateId - second.plateId);

    setTestState((current) => ({
      ...current,
      tracingResponses: latestTracingResponses
    }));

    if (!isLastPlate) {
      timeoutHandledRef.current = false;
      setCurrentIndex((value) => value + 1);
      return;
    }

    finalize(latestTracingResponses);
  };

  const handleTimeout = () => {
    if (timeoutHandledRef.current) {
      return;
    }

    timeoutHandledRef.current = true;
    setFeedback("No Response recorded for this tracing plate.");
    advance({
      plateId: currentPlate.id,
      status: "no-response",
      isCorrect: false
    });
  };

  const timer = usePlateTimer({
    durationSeconds: 60,
    plateKey: currentPlate.id,
    onExpire: handleTimeout
  });

  if (!testState.diagnosis) {
    return <Navigate to="/calibration" replace />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Step 4 of 5"
        title="Tracing Validation"
        description="The tracing stage is now organized into a cleaner workspace: timer and progress at the top, tracing canvas at the center, and session guidance in a dedicated side column."
        asideTitle="Current Diagnosis Context"
        asideDescription={`Number screening result: ${testState.diagnosis}`}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <section className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <ProgressBar
              current={currentIndex + 1}
              total={TRACING_PLATES.length}
              label={`Tracing plate ${currentPlate.id}`}
            />
            <PlateTimer secondsLeft={timer.secondsLeft} progress={timer.progress} />
          </div>

          <TraceCanvas
            plate={currentPlate}
            onSubmit={(result) => {
              setFeedback(result.isCorrect ? "Correct Trace" : "Incorrect Trace");
              advance(result);
            }}
          />
        </section>

        <aside className="space-y-4">
          <InfoCard
            eyebrow="Tracing Progress"
            title="Session Summary"
            description={`Validated traces: ${testState.tracingResponses.filter((response) => response.isCorrect).length} / ${TRACING_PLATES.length}`}
          >
            <div className="space-y-2 text-sm text-slate-600">
              <p>Unanswered tracing plates are stored as No Response.</p>
              <p>Current plate ID: {currentPlate.id}</p>
            </div>
          </InfoCard>

          <InfoCard eyebrow="Privacy" title="Canvas Handling" tone="success">
            <p className="text-sm leading-6 text-slate-600">
              Trace drawings are validated in the browser and discarded immediately after use. No canvas image data is preserved in storage.
            </p>
          </InfoCard>

          <InfoCard eyebrow="Guidance" title="Tracing Tips" tone="highlight">
            <div className="space-y-2 text-sm text-slate-600">
              {tracingGuidance.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </InfoCard>

          {feedback ? (
            <div className={`rounded-[1.5rem] border px-4 py-3 text-sm font-semibold ${feedback === "Correct Trace" ? "border-emerald-200 bg-emerald-50 text-success" : "border-rose-200 bg-rose-50 text-danger"}`}>
              {feedback}
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
};

export default TracingTest;
