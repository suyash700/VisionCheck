import clinicalRules from "../data/clinicalRules.json";
import { PLATE_TYPES } from "./plateCatalog";

const numberPlates = clinicalRules.plates.filter((plate) => plate.answerMode === "number");

const screeningPlates = numberPlates
  .filter((plate) => [PLATE_TYPES.DEMO, PLATE_TYPES.SCREENING, PLATE_TYPES.HIDDEN_DIGIT].includes(plate.type))
  .map((plate) => ({
    plate: plate.id,
    type: plate.type,
    accepted:
      plate.type === PLATE_TYPES.HIDDEN_DIGIT
        ? ["", "none", "nothing", "no number", "nil", "no response"]
        : [plate.normalAnswer]
  }));

const classificationPlates = numberPlates
  .filter((plate) => plate.type === PLATE_TYPES.CLASSIFICATION)
  .reduce((lookup, plate) => {
    lookup[plate.id] = {
      normal: plate.normalAnswer,
      protan: plate.protanAnswer,
      deutan: plate.deutanAnswer
    };
    return lookup;
  }, {});

const normalizeAnswer = (value = "") =>
  value.toString().trim().toLowerCase().replace(/\s+/g, " ");

const tokenizeAnswer = (value = "") =>
  normalizeAnswer(value)
    .replace(/clearer|more visible|stronger/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const buildResponseMap = (answers = []) =>
  answers.reduce((map, answer) => {
    map[answer.plate] = {
      ...answer,
      normalized: normalizeAnswer(answer.answer),
      tokens: tokenizeAnswer(answer.answer)
    };
    return map;
  }, {});

const isScreeningAnswerCorrect = (plateRule, response) => {
  if (!response) {
    return false;
  }

  if (plateRule.accepted.includes(response.normalized)) {
    return true;
  }

  if (plateRule.type === PLATE_TYPES.HIDDEN_DIGIT) {
    return response.tokens.length === 0;
  }

  return false;
};

const classifySubtype = (responseMap) => {
  let protanHits = 0;
  let deutanHits = 0;

  Object.entries(classificationPlates).forEach(([plateKey, rule]) => {
    const response = responseMap[Number(plateKey)];
    if (!response) {
      return;
    }

    const primary = response.tokens[0];
    if (primary === rule.protan) {
      protanHits += 1;
    }

    if (primary === rule.deutan) {
      deutanHits += 1;
    }
  });

  if (protanHits >= deutanHits) {
    return {
      diagnosis: "Color Vision Deficiency - Protanopia",
      explanation: "The classification responses on plates 22-25 favored the protan pattern."
    };
  }

  return {
    diagnosis: "Color Vision Deficiency - Deuteranopia",
    explanation: "The classification responses on plates 22-25 favored the deutan pattern."
  };
};

export const evaluateDiagnosis = (answers = []) => {
  const responseMap = buildResponseMap(answers);
  const numberScore = screeningPlates.filter((plateRule) =>
    isScreeningAnswerCorrect(plateRule, responseMap[plateRule.plate])
  ).length;

  const totalCorrectAnswers = answers.filter((answer) => {
    const response = responseMap[answer.plate];
    const classificationRule = classificationPlates[answer.plate];

    if (classificationRule) {
      return [classificationRule.normal, classificationRule.protan, classificationRule.deutan].includes(
        response.tokens[0]
      );
    }

    const screeningRule = screeningPlates.find((item) => item.plate === answer.plate);
    return screeningRule ? isScreeningAnswerCorrect(screeningRule, response) : false;
  }).length;

  if (numberScore >= 17) {
    return {
      answers,
      numberPlateScore: numberScore,
      diagnosis: "Normal Color Vision",
      explanation: "Score exceeded the clinical threshold of 17 on the Ishihara screening plates.",
      totalCorrectAnswers,
      totalQuestions: 25,
      completedAt: new Date().toISOString()
    };
  }

  if (numberScore <= 13) {
    const subtype = classifySubtype(responseMap);
    return {
      answers,
      numberPlateScore: numberScore,
      diagnosis: subtype.diagnosis,
      explanation: `${numberScore} screening plates were read normally, which falls in the deficient range. ${subtype.explanation}`,
      totalCorrectAnswers,
      totalQuestions: 25,
      completedAt: new Date().toISOString()
    };
  }

  return {
    answers,
    numberPlateScore: numberScore,
    diagnosis: "Borderline / Inconclusive Screening",
    explanation: "The score is between 14 and 16, so the screening is borderline and should be reviewed clinically.",
    totalCorrectAnswers,
    totalQuestions: 25,
    completedAt: new Date().toISOString()
  };
};
