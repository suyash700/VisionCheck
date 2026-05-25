const digitRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["none", "0", "/"]
];

const actionButtonClass =
  "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary";

const digitButtonClass =
  "rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg font-semibold text-ink transition hover:border-primary hover:bg-blue-50";

const labelMap = {
  none: "No Number",
  "/": "/"
};

const VirtualKeyboard = ({
  value,
  onAppend,
  onBackspace,
  onClear,
  onSubmit,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {digitRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-3 gap-3">
            {row.map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={disabled}
                onClick={() => onAppend(digit)}
                className={`${digitButtonClass} ${digit === "none" ? "text-sm" : ""} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {labelMap[digit] || digit}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          disabled={disabled || !value}
          onClick={onBackspace}
          className={`${actionButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Backspace
        </button>
        <button
          type="button"
          disabled={disabled || !value}
          onClick={onClear}
          className={`${actionButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Clear
        </button>
        <button
          type="button"
          disabled={disabled || !value}
          onClick={onSubmit}
          className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
