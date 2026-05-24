const screeningPlates = [
  { plate: 1, accepted: ["12"] },
  { plate: 2, accepted: ["8"] },
  { plate: 3, accepted: ["6"] },
  { plate: 4, accepted: ["29"] },
  { plate: 5, accepted: ["57"] },
  { plate: 6, accepted: ["5"] },
  { plate: 7, accepted: ["3"] },
  { plate: 8, accepted: ["15"] },
  { plate: 9, accepted: ["74"] },
  { plate: 10, accepted: ["2"] },
  { plate: 11, accepted: ["6"] },
  { plate: 12, accepted: ["97"] },
  { plate: 13, accepted: ["45"] },
  { plate: 14, accepted: ["5"] },
  { plate: 15, accepted: ["7"] },
  { plate: 16, accepted: ["16"] },
  { plate: 17, accepted: ["73"] },
  { plate: 18, accepted: ["", "none", "nothing", "no number", "nil"] },
  { plate: 19, accepted: ["", "none", "nothing", "no number", "nil"] },
  { plate: 20, accepted: ["", "none", "nothing", "no number", "nil"] },
  { plate: 21, accepted: ["", "none", "nothing", "no number", "nil"] }
];

const classificationPlates = {
  22: { normal: "26", protan: "6", deutan: "2" },
  23: { normal: "42", protan: "2", deutan: "4" },
  24: { normal: "35", protan: "5", deutan: "3" },
  25: { normal: "96", protan: "6", deutan: "9" }
};

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

  if (plateRule.plate >= 18 && plateRule.plate <= 21) {
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
      numberScore,
      diagnosis: "Normal Color Vision",
      explanation: "Score exceeded the clinical threshold of 17 on the Ishihara screening plates.",
      totalCorrectAnswers,
      totalQuestions: 25,
      date: new Date().toISOString()
    };
  }

  if (numberScore <= 13) {
    const subtype = classifySubtype(responseMap);
    return {
      answers,
      numberScore,
      diagnosis: subtype.diagnosis,
      explanation: `${numberScore} screening plates were read normally, which falls in the deficient range. ${subtype.explanation}`,
      totalCorrectAnswers,
      totalQuestions: 25,
      date: new Date().toISOString()
    };
  }

  return {
    answers,
    numberScore,
    diagnosis: "Borderline / Inconclusive Screening",
    explanation: "The score is between 14 and 16, so the screening is borderline and should be reviewed clinically.",
    totalCorrectAnswers,
    totalQuestions: 25,
    date: new Date().toISOString()
  };
};
