import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-panel">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Final Year Engineering Project
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
            VisionCheck AI for explainable digital screening of color vision deficiency.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A production-ready MERN application that uses the Ishihara 38-Plate clinical workflow as a rule-based expert system. No ML. No black-box predictions. Every screening decision is traceable to documented plate rules.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/calibration"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Start Screening
            </Link>
            <Link
              to="/admin"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Open Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold text-ink">Clinical Workflow</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>1. Calibration check with brightness, display, and distance confirmation.</p>
              <p>2. Number-plate screening on plates 1-25 using explainable rules.</p>
              <p>3. Tracing-plate capture on plates 26-38 for physician review only.</p>
              <p>4. MongoDB Atlas storage with searchable physician dashboard.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold text-ink">Rule-Based Logic</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><code>&gt;= 17</code> normal readings on plates 1-21 indicates Normal Color Vision.</p>
              <p><code>&lt;= 13</code> normal readings indicates Color Vision Deficiency.</p>
              <p>Plates 22-25 distinguish protan vs deutan patterns using manual-based comparative readings.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
