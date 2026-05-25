import clinicalRules from "../data/clinicalRules.json";

export const PLATE_TYPES = {
  DEMO: "demo",
  SCREENING: "screening",
  HIDDEN_DIGIT: "hidden-digit",
  CLASSIFICATION: "classification",
  TRACING: "tracing"
};

export const NUMBER_PLATE_TIME_LIMIT = 30;
export const TRACING_PLATE_TIME_LIMIT = 60;

export const PLATES = clinicalRules.plates.map((plate) => ({
  ...plate,
  plate: plate.id,
  timeLimit: plate.type === PLATE_TYPES.TRACING ? TRACING_PLATE_TIME_LIMIT : NUMBER_PLATE_TIME_LIMIT
}));

export const NUMBER_PLATES = PLATES.filter((plate) => plate.answerMode === "number");
export const TRACING_PLATES = PLATES.filter((plate) => plate.type === PLATE_TYPES.TRACING);

export const PLATE_LOOKUP = PLATES.reduce((lookup, plate) => {
  lookup[plate.id] = plate;
  return lookup;
}, {});

export const getPlateById = (id) => PLATE_LOOKUP[id] || null;

export const calibrationChecklist = [
  { key: "nightLightDisabled", label: "Night Light Disabled" },
  { key: "blueLightFilterDisabled", label: "Blue Light Filter Disabled" },
  { key: "colorFiltersDisabled", label: "Color Filters Disabled" },
  { key: "highContrastDisabled", label: "High Contrast Mode Disabled" }
];

export const diagnosisOptions = [
  "All",
  "Normal Color Vision",
  "Color Vision Deficiency - Deuteranopia",
  "Color Vision Deficiency - Deuteranomaly",
  "Color Vision Deficiency - Protanopia",
  "Color Vision Deficiency - Protanomaly",
  "Color Vision Deficiency - Tritanopia",
  "Borderline / Inconclusive Screening"
];