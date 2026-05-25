import { motion } from "framer-motion";

const PageHero = ({
  eyebrow,
  title,
  description,
  asideTitle,
  asideDescription,
  children
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-panel backdrop-blur sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        </div>

        {(asideTitle || asideDescription || children) ? (
          <div className="rounded-[1.6rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
            {asideTitle ? <p className="text-sm font-semibold text-ink">{asideTitle}</p> : null}
            {asideDescription ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">{asideDescription}</p>
            ) : null}
            {children ? <div className="mt-4">{children}</div> : null}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
};

export default PageHero;
