import { useEffect, useRef, useState } from "react";

const CanvasTracer = ({ onSubmit, helperText }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) {
      return;
    }

    const context = canvas.getContext("2d");
    const resizeCanvas = () => {
      const width = Math.min(wrapper.clientWidth, 560);
      const height = width;
      canvas.width = width;
      canvas.height = height;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 5;
      context.strokeStyle = "#dc2626";
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = "touches" in event ? event.touches[0] : event;
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { x, y } = getPoint(event);

    isDrawingRef.current = true;
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (event) => {
    if (!isDrawingRef.current) {
      return;
    }

    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { x, y } = getPoint(event);

    context.lineTo(x, y);
    context.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmit = () => {
    if (!hasDrawn) {
      return;
    }

    onSubmit(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">Physician Review Trace</h3>
          <p className="text-sm text-slate-500">{helperText || "Trace the visible path using touch or mouse input."}</p>
        </div>
      </div>

      <div ref={wrapperRef} className="flex justify-center rounded-[1.5rem] bg-slate-100 p-4">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[560px] rounded-[1.25rem] border border-slate-300 bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={clearCanvas}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasDrawn}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit Trace
        </button>
      </div>
    </div>
  );
};

export default CanvasTracer;
