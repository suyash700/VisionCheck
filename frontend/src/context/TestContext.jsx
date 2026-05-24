import { createContext, useContext, useMemo, useState } from "react";

const TestContext = createContext(null);

const initialCalibration = {
  brightness: false,
  nightLightDisabled: false,
  distanceMaintained: false
};

const initialTestState = {
  answers: [],
  numberScore: 0,
  diagnosis: "",
  tracingImageBase64: "",
  explanation: "",
  totalCorrectAnswers: 0,
  totalQuestions: 25,
  date: ""
};

export const TestProvider = ({ children }) => {
  const [calibrationChecks, setCalibrationChecks] = useState(initialCalibration);
  const [testState, setTestState] = useState(initialTestState);
  const [tracingSubmissions, setTracingSubmissions] = useState([]);
  const [savedResult, setSavedResult] = useState(null);

  const resetTestState = () => {
    setCalibrationChecks(initialCalibration);
    setTestState(initialTestState);
    setTracingSubmissions([]);
    setSavedResult(null);
  };

  const value = useMemo(
    () => ({
      calibrationChecks,
      setCalibrationChecks,
      testState,
      setTestState,
      tracingSubmissions,
      setTracingSubmissions,
      savedResult,
      setSavedResult,
      resetTestState
    }),
    [calibrationChecks, testState, tracingSubmissions, savedResult]
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
