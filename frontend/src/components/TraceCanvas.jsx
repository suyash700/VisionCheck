import { useEffect, useMemo, useRef, useState } from "react";
import useTracing from "../hooks/useTracing";

const getEventPoint = (event, rect) => {
  const source = "touches" in event ? event.touches[0] : event;
  return {
    x: source.clientX - rect.left,
    y: source.clientY - rect.top
  };
};

const TraceCanvas = ({ plate, onSubmit }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const currentPathRef = useRef([]);
  const drawingRef = useRef(false);
  const [feedback, setFeedback] = useState(null);
  const [canvasSize, setCanvasSize] = useState(0);
  const tracing = useTracing(plate.validation);

  const checkpointSummary = useMemo(
    () => `${plate.validation?.checkpoints?.length || 0} checkpoints required`,
    [plate.validation]
  );

  useEffect(() => {
    const resize = () => {
      if (!wrapperRef.current) {
        return;
      }

      const nextSize = Math.min(wrapperRef.current.clientWidth, 620);
      setCanvasSize(nextSize);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasSize) {
      return;
    }

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 7;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(37, 99, 235, 0.85)";
  }, [canvasSize]);

  useEffect(() => {
    tracing.clear();
    currentPathRef.current = [];
    setFeedback(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [plate.id]);

  const beginPath = (event) => {
    if (!canvasRef.current) {
      return;
    }

    event.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const point = getEventPoint(event, rect);
    drawingRef.current = true;
    currentPathRef.current = [point];
    const context = canvasRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!drawingRef.current || !canvasRef.current) {
      return;
    }

    event.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const point = getEventPoint(event, rect);
    currentPathRef.current.push(point);
    const context = canvasRef.current.getContext("2d");
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const finishPath = () => {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;
    tracing.addPath(currentPathRef.current);
    currentPathRef.current = [];
  };

  const clearCanvas = () => {
    tracing.clear();
    setFeedback(null);
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const submitTrace = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const result = tracing.validate({
      width: canvas.width,
      height: canvas.height
    });

    setFeedback(result.isCorrect ? "Correct Trace" : "Incorrect Trace");
    onSubmit({
      plateId: plate.id,
      status: result.isCorrect ? "correct" : "incorrect",
      isCorrect: result.isCorrect,
      matchedCount: result.matchedCount,
      checkpointCount: result.checkpointCount
    });
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Direct Image Tracing</h3>
          <p className="text-sm text-slate-500">Trace directly on the Ishihara plate using touch or mouse input.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {checkpointSummary}
        </div>
      </div>

      <div ref={wrapperRef} className="flex justify-center rounded-[1.5rem] bg-slate-100 p-4">
        <div className="relative w-full max-w-[620px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
          <img src={plate.image} alt={`Ishihara plate ${plate.id}`} className="block h-auto w-full" />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            onMouseDown={beginPath}
            onMouseMove={draw}
            onMouseUp={finishPath}
            onMouseLeave={finishPath}
            onTouchStart={beginPath}
            onTouchMove={draw}
            onTouchEnd={finishPath}
          />
        </div>
      </div>

      {feedback ? (
        <p className={`mt-4 text-sm font-semibold ${feedback === "Correct Trace" ? "text-success" : "text-danger"}`}>
          {feedback}
        </p>
      ) : null}

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
          onClick={submitTrace}
          disabled={!tracing.hasTrace}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit Trace
        </button>
      </div>
    </div>
  );
};

export default TraceCanvas;
