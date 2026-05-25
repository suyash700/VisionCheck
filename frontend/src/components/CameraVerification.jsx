import { memo } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { BRIGHTNESS_STATUS, FACE_STATUS } from "../hooks/useCameraVerification";

const statusConfig = {
  [FACE_STATUS.GOOD]: { label: "Good Position", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  [FACE_STATUS.TOO_FAR]: { label: "Move Closer", tone: "border-amber-200 bg-amber-50 text-amber-700" },
  [FACE_STATUS.TOO_CLOSE]: { label: "Move Back Slightly", tone: "border-rose-200 bg-rose-50 text-rose-700" },
  [FACE_STATUS.NO_FACE]: { label: "Face Not Detected", tone: "border-slate-200 bg-slate-50 text-slate-700" },
  [FACE_STATUS.MULTIPLE_FACES]: { label: "Multiple Faces Detected", tone: "border-rose-200 bg-rose-50 text-rose-700" },
  [FACE_STATUS.LOADING]: { label: "Checking Distance", tone: "border-slate-200 bg-slate-50 text-slate-700" },
  [FACE_STATUS.ERROR]: { label: "Distance Error", tone: "border-rose-200 bg-rose-50 text-rose-700" },
  [BRIGHTNESS_STATUS.GOOD]: { label: "Good Lighting", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  [BRIGHTNESS_STATUS.TOO_DARK]: { label: "Turn On Room Light", tone: "border-amber-200 bg-amber-50 text-amber-700" },
  [BRIGHTNESS_STATUS.TOO_BRIGHT]: { label: "Reduce Glare", tone: "border-rose-200 bg-rose-50 text-rose-700" },
  [BRIGHTNESS_STATUS.LOADING]: { label: "Checking Lighting", tone: "border-slate-200 bg-slate-50 text-slate-700" },
  [BRIGHTNESS_STATUS.ERROR]: { label: "Lighting Error", tone: "border-rose-200 bg-rose-50 text-rose-700" }
};

const Badge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.LOADING;
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${config.tone}`}>{config.label}</span>;
};

const MetricCard = ({ title, status, value, helper }) => (
  <motion.div whileHover={{ y: -3 }} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{helper}</p>
      </div>
      <Badge status={status} />
    </div>
    <div className="mt-5 rounded-[1.2rem] bg-slate-50 p-4">
      <p className="text-sm text-slate-500">Current Value</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  </motion.div>
);

const CameraVerification = ({
  webcamRef,
  canvasRef,
  faceWidth,
  faceStatus,
  brightnessValue,
  brightnessStatus,
  calibrationPassed,
  webcamReady,
  isInitializing,
  error,
  onUserMedia,
  onUserMediaError
}) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Live Calibration Feed
            </p>
            <h2 className="mt-1 text-xl font-semibold text-ink">
              Camera-Assisted Environment Validation
            </h2>
          </div>
          <Badge status={webcamReady ? FACE_STATUS.GOOD : FACE_STATUS.LOADING} />
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            className="h-full min-h-[320px] w-full object-cover"
          />

          {(isInitializing || !webcamReady) && !error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
              <p className="mt-4 text-sm font-medium text-white">
                Preparing face mesh and light analysis...
              </p>
            </div>
          ) : null}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {error ? (
          <div className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {calibrationPassed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
          >
            Face distance and room brightness checks are in the recommended range.
          </motion.div>
        ) : null}
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MetricCard
          title="Face Distance"
          status={faceStatus}
          value={`${faceWidth || 0} px`}
          helper="Measured using landmarks 234 and 454 to estimate viewing distance."
        />
        <MetricCard
          title="Room Brightness"
          status={brightnessStatus}
          value={brightnessValue === null ? "Measuring..." : `${brightnessValue}`}
          helper="Ambient light is sampled continuously from the webcam feed."
        />
      </div>
    </div>
  );
};

export default memo(CameraVerification);
