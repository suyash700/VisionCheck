const PlateCard = ({ plate, title, subtitle }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Ishihara Plate {plate.plate}</p>
        <h3 className="mt-1 text-xl font-semibold text-ink">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>

      <div className="bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-2">
          <img
            src={plate.image}
            alt={`Ishihara plate ${plate.plate}`}
            className="h-auto w-full rounded-[1.25rem] object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default PlateCard;
