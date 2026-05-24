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

const hiddenDigitCompanions = {
  18: 14,
  19: 10,
  20: 13,
  21: 17
};

const normalizeAnswer = (value = "") =>
  value.toString().trim().toLowerCase().replace(/\s+/g, " ");

const tokenizeAnswer = (value = "") =>
  normalizeAnswer(value)
    .replace(/clearer|more visible|stronger/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const buildResponseMap = (responses = []) =>
  responses.reduce((map, response) => {
    map[response.plate] = {
      ...response,
      normalized: normalizeAnswer(response.answer),
      tokens: tokenizeAnswer(response.answer)
    };

    return map;
  }, {});

const isScreeningAnswerCorrect = (plateRule, response) => {
  if (!response) {
    return false;
  }

  const exactMatch = plateRule.accepted.includes(response.normalized);
  if (exactMatch) {
    return true;
  }

  if (plateRule.plate >= 18 && plateRule.plate <= 21) {
    return response.tokens.length === 0;
  }

  return false;
};

const classifySubtype = (responseMap) => {
  let protanStrong = 0;
  let protanMild = 0;
  let deutanStrong = 0;
  let deutanMild = 0;

  Object.entries(classificationPlates).forEach(([plateKey, rule]) => {
    const response = responseMap[Number(plateKey)];
    if (!response) {
      return;
    }

    const [primary, secondary] = response.tokens;
    const seesNormal = response.tokens.includes(rule.normal);
    const seesProtan = response.tokens.includes(rule.protan);
    const seesDeutan = response.tokens.includes(rule.deutan);

    if (response.tokens.length === 1 && primary === rule.protan) {
      protanStrong += 1;
      return;
    }

    if (response.tokens.length === 1 && primary === rule.deutan) {
      deutanStrong += 1;
      return;
    }

    if (seesProtan && seesNormal && primary === rule.protan && secondary === rule.normal) {
      protanMild += 1;
      return;
    }

    if (seesDeutan && seesNormal && primary === rule.deutan && secondary === rule.normal) {
      deutanMild += 1;
      return;
    }

    if (seesProtan && !seesDeutan && primary === rule.protan) {
      protanMild += 1;
      return;
    }

    if (seesDeutan && !seesProtan && primary === rule.deutan) {
      deutanMild += 1;
    }
  });

  if (protanStrong >= 2 && protanStrong >= deutanStrong && protanStrong >= deutanMild) {
    return {
      diagnosis: "Color Vision Deficiency - Protanopia",
      evidence: "Only the protan numerals were predominantly reported on classification plates 22-25."
    };
  }

  if (deutanStrong >= 2 && deutanStrong >= protanStrong && deutanStrong >= protanMild) {
    return {
      diagnosis: "Color Vision Deficiency - Deuteranopia",
      evidence: "Only the deutan numerals were predominantly reported on classification plates 22-25."
    };
  }

  if (protanMild >= deutanMild) {
    return {
      diagnosis: "Color Vision Deficiency - Protanomaly",
      evidence: "Both numerals were intermittently perceived, but the protan numerals were clearer on classification plates 22-25."
    };
  }

  return {
    diagnosis: "Color Vision Deficiency - Deuteranomaly",
    evidence: "Both numerals were intermittently perceived, but the deutan numerals were clearer on classification plates 22-25."
  };
};

export const evaluateDiagnosis = (responses = []) => {
  const responseMap = buildResponseMap(responses);
  const screeningDetails = screeningPlates.map((rule) => {
    const response = responseMap[rule.plate];
    const correct = isScreeningAnswerCorrect(rule, response);

    return {
      plate: rule.plate,
      expected: rule.accepted[0] || "none",
      answer: response?.answer ?? "",
      correct
    };
  });

  const numberScore = screeningDetails.filter((item) => item.correct).length;
  const hiddenDigitFlags = [18, 19, 20, 21]
    .map((plate) => {
      const hiddenResponse = responseMap[plate];
      if (!hiddenResponse?.tokens.length) {
        return null;
      }

      const companionPlate = hiddenDigitCompanions[plate];
      const companionCorrect = screeningDetails.find((item) => item.plate === companionPlate)?.correct;

      return {
        plate,
        answer: hiddenResponse.answer,
        companionPlate,
        companionCorrect
      };
    })
    .filter(Boolean);

  if (numberScore >= 17) {
    return {
      numberScore,
      diagnosis: "Normal Color Vision",
      explanation: "17 or more of screening plates 1-21 were read normally, which meets the Ishihara screening threshold for normal color vision.",
      screeningDetails,
      hiddenDigitFlags
    };
  }

  if (numberScore <= 13) {
    const subtype = classifySubtype(responseMap);
    return {
      numberScore,
      diagnosis: subtype.diagnosis,
      explanation: `${numberScore} of 21 screening plates were read normally, which falls in the Ishihara deficient range. ${subtype.evidence}`,
      screeningDetails,
      hiddenDigitFlags
    };
  }

  return {
    numberScore,
    diagnosis: "Borderline / Inconclusive Screening",
    explanation: "The screening score falls between 14 and 16, which is a borderline range. A clinician should review the trace plates and repeat testing under controlled illumination.",
    screeningDetails,
    hiddenDigitFlags
  };
};
