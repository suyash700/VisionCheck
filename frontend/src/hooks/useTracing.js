import { useMemo, useState } from "react";

const distanceBetween = (firstPoint, secondPoint) =>
  Math.hypot(
    firstPoint.x - secondPoint.x,
    firstPoint.y - secondPoint.y
  );

const normalizePoint = (point, bounds) => ({
  x: point.x / bounds.width,
  y: point.y / bounds.height
});

const useTracing = (validation = {}) => {
  const [paths, setPaths] = useState([]);

  const flattenedPoints = useMemo(
    () => paths.flat(),
    [paths]
  );

  const clear = () => setPaths([]);

  const addPath = (path) => {
    if (!path || path.length === 0) {
      return;
    }

    setPaths((currentPaths) => [
      ...currentPaths,
      path
    ]);
  };

  const validate = (bounds) => {
    const checkpoints =
      validation.checkpoints || [];

    const tolerance =
      validation.tolerance || 0.15;

    if (
      !flattenedPoints.length ||
      !checkpoints.length ||
      !bounds?.width ||
      !bounds?.height
    ) {
      return {
        isCorrect: false,
        matchedCount: 0,
        checkpointCount: checkpoints.length,
        minimumRequired: 0
      };
    }

    const normalizedPoints =
      flattenedPoints.map((point) =>
        normalizePoint(point, bounds)
      );

    const matchedCount =
      checkpoints.filter((checkpoint) =>
        normalizedPoints.some(
          (point) =>
            distanceBetween(
              point,
              checkpoint
            ) <= tolerance
        )
      ).length;

    const minimumRequired =
      Math.ceil(
        checkpoints.length * 0.8
      );

    const isCorrect =
      matchedCount >= minimumRequired;

    console.log("Trace Validation");
    console.log(
      "Matched:",
      matchedCount
    );
    console.log(
      "Required:",
      minimumRequired
    );
    console.log(
      "Total Checkpoints:",
      checkpoints.length
    );

    return {
      isCorrect,
      matchedCount,
      checkpointCount:
        checkpoints.length,
      minimumRequired
    };
  };

  return {
    paths,
    hasTrace:
      flattenedPoints.length > 0,
    addPath,
    clear,
    validate
  };
};

export default useTracing;