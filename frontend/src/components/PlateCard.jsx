const PlateCard = ({ plate, title, subtitle, compact = false }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-panel">
      <div className={`border-b border-slate-100 px-6 ${compact ? "py-3" : "py-4"}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Ishihara Plate {plate.id}</p>
        <h3 className="mt-1 text-xl font-semibold text-ink">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>

      <div className={`bg-slate-50 ${compact ? "p-3 sm:p-4" : "p-4 sm:p-6"}`}>
        <div className={`mx-auto overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-2 ${compact ? "max-w-[620px]" : "max-w-xl"}`}>
          <img
            src={plate.image}
            alt={`Ishihara plate ${plate.id}`}
            className={`w-full rounded-[1.25rem] object-contain ${compact ? "max-h-[560px]" : "h-auto"}`}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default PlateCard;
