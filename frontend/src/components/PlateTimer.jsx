const PlateTimer = ({ secondsLeft, progress }) => (
  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-panel">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Plate Timer</p>
        <p className="mt-1 text-sm text-slate-500">Each plate advances automatically after 30 seconds.</p>
      </div>
      <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        {secondsLeft}s
      </div>
    </div>
    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-primary to-primary transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default PlateTimer;
