import { useCallback, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CalibrationScreen from "../components/CalibrationScreen";
import { useTestContext } from "../context/TestContext";
// import useCameraVerification, {
//   BRIGHTNESS_STATUS,
//   FACE_STATUS
// } from "../hooks/useCameraVerification";

const Calibration = () => {
  const navigate = useNavigate();
  const { calibrationChecks, setCalibrationChecks, testState } = useTestContext();

const webcamRef = null;
const canvasRef = null;
const webcamReady = true;
const isInitializing = false;
const faceWidth = 200;
const faceStatus = "GOOD";
const brightnessValue = 120;
const brightnessStatus = "GOOD";
const calibrationPassed = true;
const error = "";

const handleUserMedia = () => {};
const handleUserMediaError = () => {};

const faceDistancePass = true;
const roomLightingPass = true;
  const brightnessConfirmed = calibrationChecks.brightnessConfirmed;
  const nightModeDisabled = calibrationChecks.nightModeDisabled;

const overallReady = true;

const readinessPercent = 100;

  const handleToggleCheck = useCallback((key) => {
    setCalibrationChecks((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }, [setCalibrationChecks]);

  const handleStart = useCallback(() => {
    
      navigate("/number-test");
    
  }, [navigate, overallReady]);

  if (!testState.participantName || !testState.participantAge) {
    return <Navigate to="/patient-info" replace />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CalibrationScreen
        checks={calibrationChecks}
        onToggleCheck={handleToggleCheck}
        faceDistancePass={faceDistancePass}
        roomLightingPass={roomLightingPass}
        overallReady={overallReady}
        readinessPercent={readinessPercent}
        onStart={handleStart}
        cameraProps={{
          webcamRef,
          canvasRef,
          webcamReady,
          isInitializing,
          faceWidth,
          faceStatus,
          brightnessValue,
          brightnessStatus,
          calibrationPassed,
          error,
          onUserMedia: handleUserMedia,
          onUserMediaError: handleUserMediaError
        }}
      />
    </main>
  );
};

export default Calibration;
