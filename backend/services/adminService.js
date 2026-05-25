export const buildResultFilters = (query = {}) => {
  const filters = {};

  if (query.diagnosis) {
    filters.diagnosis = query.diagnosis;
  }

  if (query.search) {
    filters.name = {
      $regex: query.search,
      $options: "i"
    };
  }

  if (query.status) {
    filters.completionStatus = query.status;
  }

  if (query.startDate || query.endDate) {
    filters.completedAt = {};

    if (query.startDate) {
      filters.completedAt.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filters.completedAt.$lte = endDate;
    }
  }

  return filters;
};

export const buildDashboardStats = (results = []) => {
  const diagnosisMap = new Map();
  const monthlyMap = new Map();

  results.forEach((result) => {
    const diagnosis = result.diagnosis || "Unknown";
    diagnosisMap.set(diagnosis, (diagnosisMap.get(diagnosis) || 0) + 1);

    const dateValue = result.completedAt || result.createdAt;
    if (!dateValue) {
      return;
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return;
    }

    const monthKey = parsedDate.toISOString().slice(0, 7);
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
  });

  return {
    totalTests: results.length,
    normalVision: results.filter((item) => /normal color vision/i.test(item.diagnosis || "")).length,
    deuteranopia: results.filter((item) => /deuteranopia/i.test(item.diagnosis || "")).length,
    protanopia: results.filter((item) => /protanopia/i.test(item.diagnosis || "")).length,
    tritanopia: results.filter((item) => /tritanopia/i.test(item.diagnosis || "")).length,
    incompleteTests: results.filter((item) => item.completionStatus !== "completed").length,
    diagnosisDistribution: Array.from(diagnosisMap.entries()).map(([label, value]) => ({
      label,
      value
    })),
    monthlyAssessments: Array.from(monthlyMap.entries())
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([label, value]) => ({
        label,
        value
      }))
  };
};

const sanitizeCsvValue = (value) => {
  const normalized = `${value ?? ""}`.replace(/"/g, "\"\"");
  return `"${normalized}"`;
};

export const buildExportCsv = (results = []) => {
  const headers = [
    "name",
    "age",
    ...Array.from({ length: 38 }, (_, index) => `plate_${index + 1}`),
    "diagnosis",
    "completion_status",
    "consent",
    "timestamp"
  ];

  const rows = results.map((result) => {
    const numberResponses = result.responses?.number || [];
    const responseMap = numberResponses.reduce((lookup, item) => {
      lookup[item.plate] = item.answer;
      return lookup;
    }, {});

    const cells = [
      result.name || "",
      result.age || "",
      ...Array.from({ length: 38 }, (_, index) => responseMap[index + 1] || ""),
      result.diagnosis || "",
      result.completionStatus || "",
      result.consent ? "true" : "false",
      result.completedAt ? new Date(result.completedAt).toISOString() : ""
    ];

    return cells.map(sanitizeCsvValue).join(",");
  });

  return [headers.join(","), ...rows].join("\n");
};
