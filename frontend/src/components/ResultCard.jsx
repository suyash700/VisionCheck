import { memo, useMemo } from "react";

const recommendationMap = {
  normal: "No abnormal screening pattern detected. If symptoms persist, consider formal clinical evaluation.",
  deficient: "A color vision deficiency pattern was identified. Recommend confirmatory ophthalmic or optometric review.",
  borderline: "Borderline screening result. Repeat the assessment under controlled conditions or refer for clinical review."
};

const ResultCard = ({ result }) => {
  const diagnosisTone =
    result?.diagnosis === "Normal Color Vision"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : result?.diagnosis?.includes("Borderline")
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

  const confidence = useMemo(() => {
    if (result?.diagnosis?.includes("Borderline")) {
      return "Moderate";
    }
    return "High";
  }, [result?.diagnosis]);

  const recommendation = useMemo(() => {
    if (result?.diagnosis === "Normal Color Vision") return recommendationMap.normal;
    if (result?.diagnosis?.includes("Borderline")) return recommendationMap.borderline;
    return recommendationMap.deficient;
  }, [result?.diagnosis]);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
      <div className={`rounded-[1.5rem] border p-6 ${diagnosisTone}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em]">Diagnosis</p>
        <h2 className="mt-2 text-3xl font-bold">{result?.diagnosis}</h2>
        <p className="mt-3 text-sm leading-6">{result?.explanation || result?.clinicalExplanation}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Patient Name</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.participantName || "Anonymous"}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Age</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.participantAge || "N/A"}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Assessment Date</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.dateLabel || "Pending save"}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Confidence</p>
          <p className="mt-1 text-lg font-semibold text-ink">{confidence}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Number Test Summary</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.numberPlateScore ?? 0} / 21</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Tracing Test Summary</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.tracingPlateScore ?? 0}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">No Response Count</p>
          <p className="mt-1 text-lg font-semibold text-ink">{result?.noResponseCount ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-500">Recommendations</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">{recommendation}</p>
      </div>
    </div>
  );
};

export default memo(ResultCard);