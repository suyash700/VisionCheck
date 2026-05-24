const ResultCard = ({ result }) => {
  const diagnosisTone =
    result?.diagnosis === "Normal Color Vision"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : result?.diagnosis?.includes("Borderline")
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
      <div className={`rounded-[1.5rem] border p-5 ${diagnosisTone}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em]">Diagnosis</p>
        <h2 className="mt-2 text-2xl font-bold">{result?.diagnosis}</h2>
        <p className="mt-3 text-sm leading-6">{result?.explanation || result?.clinicalExplanation}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Score</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.numberScore} / 21</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Questions</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.totalQuestions || 25}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Correct Answers</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.totalCorrectAnswers ?? result?.numberScore}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Recorded On</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.dateLabel || "Pending save"}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
