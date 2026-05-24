import { Link, Navigate } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import { useTestContext } from "../context/TestContext";

const Result = () => {
  const { testState, tracingSubmissions, savedResult, resetTestState } = useTestContext();

  if (!testState.diagnosis) {
    return <Navigate to="/calibration" replace />;
  }

  const resultView = {
    ...testState,
    ...savedResult,
    answers: savedResult?.answers || testState.answers,
    dateLabel: new Date(savedResult?.date || testState.date).toLocaleString(),
    clinicalExplanation: testState.explanation
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <ResultCard result={resultView} />

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
          <h2 className="text-xl font-semibold text-ink">Clinical Explanation</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Reason</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{testState.explanation}</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Rule Threshold</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                A screening score of 17 or higher indicates normal color vision. A score of 13 or lower indicates color vision deficiency, and plates 22-25 determine the protan versus deutan pattern.
              </p>
            </div>
          </div>
          <p className="mt-4 text-slate-600">Tracing submissions stored for review: {tracingSubmissions.length}</p>
          <p className="mt-2 text-slate-600">Saved to database: {savedResult?._id ? "Yes" : "Pending"}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/calibration"
              onClick={resetTestState}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Start New Screening
            </Link>
            <Link
              to="/admin"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Review Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Result;
