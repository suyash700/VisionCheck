const StatCard = ({ label, value, tone = "blue" }) => {
  const toneMap = {
    blue: "border-blue-100 bg-blue-50 text-blue-900",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-900",
    amber: "border-amber-100 bg-amber-50 text-amber-900",
    rose: "border-rose-100 bg-rose-50 text-rose-900"
  };

  return (
    <div className={`rounded-[1.75rem] border p-5 shadow-panel ${toneMap[tone] || toneMap.blue}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
