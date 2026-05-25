import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as FaceMeshModule from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export const FACE_STATUS = {
  LOADING: "LOADING",
  NO_FACE: "NO_FACE",
  MULTIPLE_FACES: "MULTIPLE_FACES",
  TOO_CLOSE: "TOO_CLOSE",
  TOO_FAR: "TOO_FAR",
  GOOD: "GOOD",
  ERROR: "ERROR"
};

export const BRIGHTNESS_STATUS = {
  LOADING: "LOADING",
  TOO_DARK: "TOO_DARK",
  TOO_BRIGHT: "TOO_BRIGHT",
  GOOD: "GOOD",
  ERROR: "ERROR"
};

const FACE_WIDTH_MIN = 150;
const FACE_WIDTH_MAX = 300;
const BRIGHTNESS_MIN = 50;
const BRIGHTNESS_MAX = 180;
const DEFAULT_RECOMMENDED_BRIGHTNESS = 75;

export const getRecommendedScreenBrightness = (value) => {
  if (value === null || Number.isNaN(value)) {
    return DEFAULT_RECOMMENDED_BRIGHTNESS;
  }
  if (value < 50) return 90;
  if (value <= 120) return 75;
  if (value <= 180) return 60;
  return 40;
};

export const getBrightnessRecommendationRange = (recommendedBrightness) => ({
  min: Math.max(0, recommendedBrightness - 10),
  max: Math.min(100, recommendedBrightness + 10)
});

const getFaceStatus = (value) => {
  if (!value) return FACE_STATUS.NO_FACE;
  if (value > FACE_WIDTH_MAX) return FACE_STATUS.TOO_CLOSE;
  if (value < FACE_WIDTH_MIN) return FACE_STATUS.TOO_FAR;
  return FACE_STATUS.GOOD;
};

const getBrightnessStatus = (value) => {
  if (value === null) return BRIGHTNESS_STATUS.LOADING;
  if (value < BRIGHTNESS_MIN) return BRIGHTNESS_STATUS.TOO_DARK;
  if (value > BRIGHTNESS_MAX) return BRIGHTNESS_STATUS.TOO_BRIGHT;
  return BRIGHTNESS_STATUS.GOOD;
};

const useCameraVerification = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const brightnessIntervalRef = useRef(null);
  const initializedRef = useRef(false);

  const [webcamReady, setWebcamReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState("");
  const [faceWidth, setFaceWidth] = useState(0);
  const [faceStatus, setFaceStatus] = useState(FACE_STATUS.LOADING);
  const [brightnessValue, setBrightnessValue] = useState(null);
  const [brightnessStatus, setBrightnessStatus] = useState(BRIGHTNESS_STATUS.LOADING);

  const cleanup = useCallback(() => {
    if (brightnessIntervalRef.current) {
      window.clearInterval(brightnessIntervalRef.current);
      brightnessIntervalRef.current = null;
    }

    if (cameraRef.current?.stop) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    if (faceMeshRef.current?.close) {
      faceMeshRef.current.close();
      faceMeshRef.current = null;
    }

    const stream = webcamRef.current?.video?.srcObject;
    if (stream?.getTracks) {
      stream.getTracks().forEach((track) => track.stop());
    }

    initializedRef.current = false;
  }, []);

  const calculateBrightness = useCallback(() => {
    try {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState < 2) {
        return;
      }

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        setBrightnessStatus(BRIGHTNESS_STATUS.ERROR);
        setError("Brightness calculation failure.");
        return;
      }

      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const { data } = context.getImageData(0, 0, width, height);

      let totalBrightness = 0;
      const pixelCount = data.length / 4;

      for (let index = 0; index < data.length; index += 4) {
        totalBrightness += (data[index] + data[index + 1] + data[index + 2]) / 3;
      }

      const average = pixelCount ? Math.round(totalBrightness / pixelCount) : 0;
      setBrightnessValue(average);
      setBrightnessStatus(getBrightnessStatus(average));
    } catch (_error) {
      setBrightnessStatus(BRIGHTNESS_STATUS.ERROR);
      setError("Brightness calculation failure.");
    }
  }, []);

  const initialize = useCallback(async () => {
    if (initializedRef.current || !webcamReady || !webcamRef.current?.video) {
      return;
    }

    try {
      initializedRef.current = true;
      setIsInitializing(true);
      setError("");

      const faceMesh = new FaceMeshModule.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 2,
        refineLandmarks: false,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      faceMesh.onResults((results) => {
        const faces = results.multiFaceLandmarks || [];

        if (faces.length === 0) {
          setFaceWidth(0);
          setFaceStatus(FACE_STATUS.NO_FACE);
          return;
        }

        if (faces.length > 1) {
          setFaceWidth(0);
          setFaceStatus(FACE_STATUS.MULTIPLE_FACES);
          return;
        }

        const landmarks = faces[0];
        const left = landmarks[234];
        const right = landmarks[454];

        if (!left || !right) {
          setFaceWidth(0);
          setFaceStatus(FACE_STATUS.NO_FACE);
          return;
        }

        const resultWidth = results.image.width || webcamRef.current.video.videoWidth || 640;
        const resultHeight = results.image.height || webcamRef.current.video.videoHeight || 480;

        const x1 = left.x * resultWidth;
        const y1 = left.y * resultHeight;
        const x2 = right.x * resultWidth;
        const y2 = right.y * resultHeight;

        const measuredFaceWidth = Math.round(
          Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        );

        setFaceWidth(measuredFaceWidth);
        setFaceStatus(getFaceStatus(measuredFaceWidth));
      });

      faceMeshRef.current = faceMesh;

      cameraRef.current = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (faceMeshRef.current && webcamRef.current?.video) {
            await faceMeshRef.current.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480
      });

      await cameraRef.current.start();

      calculateBrightness();
      brightnessIntervalRef.current = window.setInterval(calculateBrightness, 1000);
      setIsInitializing(false);
    } catch (error) {
  console.error("MediaPipe initialization error:", error);

  setFaceStatus(FACE_STATUS.ERROR);
  setBrightnessStatus(BRIGHTNESS_STATUS.ERROR);

  setError(
    `MediaPipe initialization failure: ${
      error?.message || "Unknown error"
    }`
  );

  setIsInitializing(false);
}
  }, [calculateBrightness, webcamReady]);

  useEffect(() => {
    if (webcamReady) {
      initialize();
    }

    return cleanup;
  }, [cleanup, initialize, webcamReady]);

  const handleUserMedia = useCallback(() => {
    setWebcamReady(true);
    setError("");
  }, []);

  const handleUserMediaError = useCallback(() => {
    setWebcamReady(false);
    setIsInitializing(false);
    setFaceStatus(FACE_STATUS.ERROR);
    setBrightnessStatus(BRIGHTNESS_STATUS.ERROR);
    setError("Camera permission denied or camera unavailable.");
  }, []);

  const calibrationPassed = useMemo(
    () => faceStatus === FACE_STATUS.GOOD && brightnessStatus === BRIGHTNESS_STATUS.GOOD,
    [brightnessStatus, faceStatus]
  );

  const recommendedScreenBrightness = useMemo(
    () => getRecommendedScreenBrightness(brightnessValue),
    [brightnessValue]
  );

  const recommendedBrightnessRange = useMemo(
    () => getBrightnessRecommendationRange(recommendedScreenBrightness),
    [recommendedScreenBrightness]
  );

  return {
    webcamRef,
    canvasRef,
    webcamReady,
    isInitializing,
    faceWidth,
    faceStatus,
    brightnessValue,
    brightnessStatus,
    recommendedScreenBrightness,
    recommendedBrightnessRange,
    calibrationPassed,
    error,
    handleUserMedia,
    handleUserMediaError
  };
};

export default useCameraVerification;
