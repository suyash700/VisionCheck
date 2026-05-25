import { createContext, useContext, useMemo, useState } from "react";

const TestContext = createContext(null);

const initialCalibration = {
  brightnessConfirmed: false,
  nightModeDisabled: false
};

const initialTestState = {
  participantName: "",
  participantAge: "",
  displayPreferences: {
    brightnessBoost: 100,
    temperature: 0,
    darkMode: false,
    optimized: false
  },
  answers: [],
  tracingResponses: [],
  numberPlateScore: 0,
  tracingPlateScore: 0,
  noResponseCount: 0,
  diagnosis: "",
  explanation: "",
  totalCorrectAnswers: 0,
  totalQuestions: 25,
  completedAt: "",
  saveStatus: "idle"
};

const initialCameraVerification = {
  faceWidth: 0,
  faceStatus: "LOADING",
  brightnessValue: null,
  brightnessStatus: "LOADING",
  movementStatus: "LOADING",
  movementMessage: "",
  movementWarningCount: 0,
  shouldPauseAssessment: false,
  calibrationPassed: true,
  webcamReady: false,
  error: ""
};

export const TestProvider = ({ children }) => {
  const [calibrationChecks, setCalibrationChecks] = useState(initialCalibration);
  const [testState, setTestState] = useState(initialTestState);
  const [cameraVerification, setCameraVerification] = useState(initialCameraVerification);
  const [savedResult, setSavedResult] = useState(null);

  const resetTestState = () => {
    setCalibrationChecks(initialCalibration);
    setTestState(initialTestState);
    setCameraVerification(initialCameraVerification);
    setSavedResult(null);
  };

  const value = useMemo(
    () => ({
      calibrationChecks,
      setCalibrationChecks,
      testState,
      setTestState,
      cameraVerification,
      setCameraVerification,
      savedResult,
      setSavedResult,
      resetTestState
    }),
    [calibrationChecks, testState, cameraVerification, savedResult]
  );

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

export const useTestContext = () => {
  const context = useContext(TestContext);

  if (!context) {
    throw new Error("useTestContext must be used within a TestProvider");
  }

  return context;
};
