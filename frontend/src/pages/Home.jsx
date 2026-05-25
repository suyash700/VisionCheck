import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import PageHero from "../components/PageHero";

const featureGroups = [
  {
    title: "Environment Readiness",
    description: "Face distance, room lighting, and display checks run before any plate appears."
  },
  {
    title: "Guided Assessment Flow",
    description: "Every screen has one clear responsibility, which reduces confusion during screening."
  },
  {
    title: "Clinical Rule Engine",
    description: "Number-plate responses are interpreted using deterministic Ishihara decision rules."
  },
  {
    title: "Structured Reporting",
    description: "Results are summarized into clinician-friendly findings and progress metrics."
  }
];

const workflow = [
  { step: "01", title: "Register", copy: "Capture only the participant details needed to begin." },
  { step: "02", title: "Calibrate", copy: "Verify environment conditions before showing Ishihara plates." },
  { step: "03", title: "Screen", copy: "Complete number recognition and tracing tasks in sequence." },
  { step: "04", title: "Review", copy: "See rule-based outcomes and a structured screening summary." }
];

const confidencePoints = [
  "Environment checks before test launch",
  "Timed plate workflow with saved progress",
  "Rule-based interpretation for consistency"
];

const Home = () => {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef5ff_42%,_#f8fafc_100%)]" />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PageHero
          eyebrow="AI-Assisted Ishihara Screening"
          title="VisionCheck AI"
          description="A calmer, more structured digital screening workflow for color vision assessment. VisionCheck AI combines environment calibration, guided Ishihara testing, and rule-based clinical interpretation in one experience."
          asideTitle="Why This Flow Works"
          asideDescription="The product reduces false starts by validating readiness before testing, then moves the user through a predictable step-by-step sequence."
        >
          <div className="space-y-3">
            {confidencePoints.map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </PageHero>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
              Screening Overview
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Safe screening starts with a better first impression.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The landing experience should feel clinical, guided, and trustworthy. This updated layout introduces clearer hierarchy and better separation between value, workflow, and next actions.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/patient-info"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Start Assessment
              </Link>
              <Link
                to="/admin"
                className="rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Admin Dashboard
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureGroups.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
              >
                <InfoCard title={item.title} description={item.description} className="h-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflow.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <InfoCard
                eyebrow={`Step ${item.step}`}
                title={item.title}
                description={item.copy}
                className="h-full"
                tone={index % 2 === 0 ? "default" : "soft"}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default memo(Home);
