const toneMap = {
  default: "border-slate-200 bg-white",
  soft: "border-slate-200 bg-slate-50/80",
  highlight: "border-blue-100 bg-blue-50",
  success: "border-emerald-100 bg-emerald-50"
};

const InfoCard = ({
  eyebrow,
  title,
  description,
  children,
  className = "",
  tone = "default"
}) => {
  return (
    <div className={`rounded-[1.75rem] border p-5 shadow-sm ${toneMap[tone] || toneMap.default} ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      ) : null}
      {title ? <h3 className="mt-2 text-lg font-semibold text-ink">{title}</h3> : null}
      {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
};

export default InfoCard;
