import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import PageHero from "../components/PageHero";
import { useTestContext } from "../context/TestContext";

const intakeNotes = [
  "Only the participant name and age are collected here.",
  "Progress continues directly into calibration after validation.",
  "The full registration step usually takes less than 10 seconds."
];

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100";

const PatientInfo = () => {
  const navigate = useNavigate();
  const { testState, setTestState } = useTestContext();
  const [name, setName] = useState(testState.participantName || "");
  const [age, setAge] = useState(testState.participantAge || "");
  const [errors, setErrors] = useState({});

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && /^\d+$/.test(age) && Number(age) >= 1 && Number(age) <= 120;
  }, [age, name]);

  const validate = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Patient name is required.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Patient name must be at least 2 characters.";
    } else if (name.trim().length > 50) {
      nextErrors.name = "Patient name must be 50 characters or fewer.";
    }

    if (!age.trim()) {
      nextErrors.age = "Age is required.";
    } else if (!/^\d+$/.test(age)) {
      nextErrors.age = "Age must be numeric only.";
    } else if (Number(age) < 1 || Number(age) > 120) {
      nextErrors.age = "Age must be between 1 and 120.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) {
      return;
    }

    setTestState((current) => ({
      ...current,
      participantName: name.trim(),
      participantAge: age.trim()
    }));

    navigate("/calibration");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Step 1 of 5"
        title="Participant Details"
        description="Capture only the essentials required to begin the screening workflow. This page now separates instructions from data entry so the form feels lighter and easier to complete."
        asideTitle="Before You Continue"
        asideDescription="Keep the participant seated comfortably, then move into environment calibration right after saving these details."
      >
        <div className="space-y-3">
          {intakeNotes.map((note) => (
            <div key={note} className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700">
              {note}
            </div>
          ))}
        </div>
      </PageHero>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Patient Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter patient name"
                className={inputClass}
              />
              {errors.name ? <p className="mt-2 text-sm text-danger">{errors.name}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Age</span>
              <input
                type="text"
                inputMode="numeric"
                value={age}
                onChange={(event) => setAge(event.target.value.replace(/[^\d]/g, ""))}
                placeholder="Enter age"
                className={inputClass}
              />
              {errors.age ? <p className="mt-2 text-sm text-danger">{errors.age}</p> : null}
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] bg-slate-50 px-5 py-4">
            <p className="text-sm text-slate-600">
              {canSubmit ? "Details look good. Continue to calibration." : "Enter a valid name and age to continue."}
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue to Calibration
            </button>
          </div>
        </motion.section>

        <div className="space-y-4">
          <InfoCard
            eyebrow="Quick Guide"
            title="What happens next?"
            description="The next page checks camera distance, room lighting, and display readiness before starting the Ishihara assessment."
            tone="highlight"
          />
          <InfoCard
            eyebrow="Readiness"
            title="Current Form Status"
            description={canSubmit ? "All required fields are valid." : "Form is incomplete or still has validation errors."}
            tone={canSubmit ? "success" : "soft"}
          />
        </div>
      </div>
    </main>
  );
};

export default memo(PatientInfo);
