import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTestContext } from "../context/TestContext";

const Calibration = () => {
  const navigate = useNavigate();
  const { calibrationChecks, setCalibrationChecks } = useTestContext();

  const allChecked = useMemo(
    () => Object.values(calibrationChecks).every(Boolean),
    [calibrationChecks]
  );

  const toggleCheck = (key) => {
    setCalibrationChecks((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const handleStart = () => {
    if (allChecked) {
      navigate("/number-test");
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-panel">
        <h1 className="text-3xl font-bold text-ink">Calibration Screen</h1>
        <p className="mt-3 text-slate-600">
          Confirm the test environment before the Ishihara plates are shown. The screening should be completed under stable lighting and at approximately 60 cm viewing distance.
        </p>

        <div className="mt-8 space-y-4">
          {[
            ["brightness", "Brightness is set to 100%"],
            ["nightLightDisabled", "Night Light / True Tone is disabled"],
            ["distanceMaintained", "Viewing distance is about one arm length (~60 cm)"]
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-primary"
            >
              <input
                type="checkbox"
                checked={calibrationChecks[key]}
                onChange={() => toggleCheck(key)}
                className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          disabled={!allChecked}
          onClick={handleStart}
          className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Start Test
        </button>
      </div>
    </main>
  );
};

export default Calibration;
