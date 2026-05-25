import { useCallback, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CalibrationScreen from "../components/CalibrationScreen";
import { useTestContext } from "../context/TestContext";
import useCameraVerification, {
  BRIGHTNESS_STATUS,
  FACE_STATUS
} from "../hooks/useCameraVerification";

const Calibration = () => {
  const navigate = useNavigate();
  const { calibrationChecks, setCalibrationChecks, testState } = useTestContext();

  const {
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
    handleUserMedia,
    handleUserMediaError
  } = useCameraVerification();

  const faceDistancePass = faceStatus === FACE_STATUS.GOOD;
  const roomLightingPass = brightnessStatus === BRIGHTNESS_STATUS.GOOD;
  const brightnessConfirmed = calibrationChecks.brightnessConfirmed;
  const nightModeDisabled = calibrationChecks.nightModeDisabled;

  const overallReady = useMemo(() => {
    return faceDistancePass && roomLightingPass && brightnessConfirmed && nightModeDisabled;
  }, [brightnessConfirmed, faceDistancePass, nightModeDisabled, roomLightingPass]);

  const readinessPercent = useMemo(() => {
    const checks = [
      faceDistancePass,
      roomLightingPass,
      brightnessConfirmed,
      nightModeDisabled
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [brightnessConfirmed, faceDistancePass, nightModeDisabled, roomLightingPass]);

  const handleToggleCheck = useCallback((key) => {
    setCalibrationChecks((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }, [setCalibrationChecks]);

  const handleStart = useCallback(() => {
    if (overallReady) {
      navigate("/number-test");
    }
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
