import { memo } from "react";

const summaryCardClass = "rounded-[1.5rem] bg-slate-50 p-4";

const AssessmentSummary = ({ testState, savedResult }) => {
  const source = savedResult || testState;
  const completedAt = source?.completedAt || testState.completedAt;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
      <h2 className="text-xl font-semibold text-ink">Assessment Summary</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className={summaryCardClass}>
          <p className="text-sm text-slate-500">Patient</p>
          <p className="mt-1 text-lg font-semibold text-ink">{testState.participantName || "Anonymous"}</p>
        </div>
        <div className={summaryCardClass}>
          <p className="text-sm text-slate-500">Age</p>
          <p className="mt-1 text-lg font-semibold text-ink">{testState.participantAge || "N/A"}</p>
        </div>
        <div className={summaryCardClass}>
          <p className="text-sm text-slate-500">Total Correct Answers</p>
          <p className="mt-1 text-lg font-semibold text-ink">{testState.totalCorrectAnswers ?? 0}</p>
        </div>
        <div className={summaryCardClass}>
          <p className="text-sm text-slate-500">Total Questions</p>
          <p className="mt-1 text-lg font-semibold text-ink">{testState.totalQuestions ?? 25}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Completed on {completedAt ? new Date(completedAt).toLocaleString() : "Not saved yet"}
      </p>
    </div>
  );
};

export default memo(AssessmentSummary);