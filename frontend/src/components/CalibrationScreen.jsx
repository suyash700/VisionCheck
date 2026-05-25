import { memo } from "react";
import { motion } from "framer-motion";
import CameraVerification from "./CameraVerification";

const rowClass = "rounded-2xl bg-slate-50 px-4 py-3";

const confirmationItems = [
  {
    key: "brightnessConfirmed",
    label: "My screen brightness is set to at least 70%"
  },
  {
    key: "nightModeDisabled",
    label: "Night Mode / Blue Light Filter is disabled"
  }
];

const CalibrationScreen = ({
  checks,
  onToggleCheck,
  faceDistancePass,
  roomLightingPass,
  overallReady,
  readinessPercent,
  onStart,
  cameraProps
}) => {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-panel"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Step 2 of 5
            </p>
            <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
              Environment Calibration
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Face distance and room lighting are checked automatically. Confirm your display settings manually before starting the Ishihara screening.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-ink">Readiness Target</p>
            <p className="mt-2">All four checks must pass before the number test can begin.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <CameraVerification {...cameraProps} />

            <motion.div whileHover={{ y: -3 }} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Display Confirmation</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${checks.brightnessConfirmed && checks.nightModeDisabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {checks.brightnessConfirmed && checks.nightModeDisabled ? "Confirmed" : "Action Needed"}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {confirmationItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-start gap-3 rounded-[1.2rem] border border-slate-200 p-4 transition hover:border-primary"
                  >
                    <input
                      type="checkbox"
                      checked={checks[item.key]}
                      onChange={() => onToggleCheck(item.key)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          <aside className="rounded-[1.9rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Readiness Panel
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Environment Readiness</h2>

            <div className="mt-6 space-y-3">
              <div className={rowClass}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">Face Distance</span>
                  <span className={`text-sm font-semibold ${faceDistancePass ? "text-emerald-600" : "text-rose-600"}`}>
                    {faceDistancePass ? "PASS" : "WAIT"}
                  </span>
                </div>
              </div>
              <div className={rowClass}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">Room Lighting</span>
                  <span className={`text-sm font-semibold ${roomLightingPass ? "text-emerald-600" : "text-rose-600"}`}>
                    {roomLightingPass ? "PASS" : "WAIT"}
                  </span>
                </div>
              </div>
              <div className={rowClass}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">Screen Brightness</span>
                  <span className={`text-sm font-semibold ${checks.brightnessConfirmed ? "text-emerald-600" : "text-rose-600"}`}>
                    {checks.brightnessConfirmed ? "PASS" : "WAIT"}
                  </span>
                </div>
              </div>
              <div className={rowClass}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">Night Mode Disabled</span>
                  <span className={`text-sm font-semibold ${checks.nightModeDisabled ? "text-emerald-600" : "text-rose-600"}`}>
                    {checks.nightModeDisabled ? "PASS" : "WAIT"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.4rem] bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Overall Readiness</p>
              <p className="mt-2 text-4xl font-bold">{readinessPercent}%</p>
              <p className="mt-3 text-sm font-medium text-slate-200">
                {overallReady ? "READY FOR TEST" : "ENVIRONMENT NOT READY"}
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${readinessPercent}%` }}
                  className={`h-full rounded-full ${overallReady ? "bg-emerald-400" : "bg-amber-400"}`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onStart}
              disabled={!overallReady}
              className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-slate-400"
            >
              {overallReady ? "Start Number Test" : "Environment Not Ready"}
            </button>
          </aside>
        </div>
      </motion.section>
    </div>
  );
};

export default memo(CalibrationScreen);
