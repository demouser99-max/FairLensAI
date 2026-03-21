export interface BiasMetric {
  group: string;
  selectionRate: number;
  truePositiveRate: number;
}

export interface ShapFeature {
  feature: string;
  importance: number;
}

export interface Candidate {
  id: number;
  experience: number;
  education: string;
  techScore: number;
  interviewScore: number;
  age: number;
  gender: string;
  biasedPrediction: number;
  fairPrediction: number;
}

export interface AnalysisResult {
  totalCandidates: number;
  testSize: number;
  biasedModel: {
    accuracy: number;
    demographicParityDiff: number;
    equalOpportunityDiff: number;
    biasScore: number;
  };
  fairModel: {
    accuracy: number;
    demographicParityDiff: number;
    equalOpportunityDiff: number;
    biasScore: number;
  };
  groupMetricsBefore: BiasMetric[];
  groupMetricsAfter: BiasMetric[];
  shapImportance: ShapFeature[];
  candidates: Candidate[];
}

// Real values computed via scikit-learn + Fairlearn + SHAP on 800-candidate hiring dataset
export const analysisData: AnalysisResult = {
  totalCandidates: 800,
  testSize: 200,
  biasedModel: {
    accuracy: 0.89,
    demographicParityDiff: 0.702,
    equalOpportunityDiff: 0.4879,
    biasScore: 0.6163,
  },
  fairModel: {
    accuracy: 0.715,
    demographicParityDiff: 0.0767,
    equalOpportunityDiff: 0.3797,
    biasScore: 0.1979,
  },
  groupMetricsBefore: [
    { group: "Male", selectionRate: 0.9204, truePositiveRate: 0.9794 },
    { group: "Female", selectionRate: 0.2184, truePositiveRate: 0.7 },
  ],
  groupMetricsAfter: [
    { group: "Male", selectionRate: 0.7434, truePositiveRate: 0.8351 },
    { group: "Female", selectionRate: 0.6667, truePositiveRate: 1.0 },
  ],
  shapImportance: [
    { feature: "Gender", importance: 2.3694 },
    { feature: "Experience", importance: 1.5768 },
    { feature: "Tech Score", importance: 0.8124 },
    { feature: "Interview Score", importance: 0.6897 },
    { feature: "Education", importance: 0.3358 },
    { feature: "Age", importance: 0.1302 },
  ],
  candidates: [
    { id: 1, experience: 4, education: "Masters", techScore: 78, interviewScore: 36, age: 46, gender: "Female", biasedPrediction: 0, fairPrediction: 0 },
    { id: 2, experience: 12, education: "Masters", techScore: 79, interviewScore: 48, age: 42, gender: "Male", biasedPrediction: 1, fairPrediction: 1 },
    { id: 3, experience: 3, education: "High School", techScore: 80, interviewScore: 57, age: 34, gender: "Male", biasedPrediction: 1, fairPrediction: 0 },
    { id: 4, experience: 4, education: "Masters", techScore: 60, interviewScore: 35, age: 32, gender: "Male", biasedPrediction: 1, fairPrediction: 0 },
    { id: 5, experience: 12, education: "High School", techScore: 67, interviewScore: 36, age: 53, gender: "Female", biasedPrediction: 0, fairPrediction: 1 },
    { id: 6, experience: 12, education: "High School", techScore: 47, interviewScore: 32, age: 23, gender: "Male", biasedPrediction: 1, fairPrediction: 1 },
    { id: 7, experience: 2, education: "Bachelors", techScore: 54, interviewScore: 72, age: 35, gender: "Male", biasedPrediction: 0, fairPrediction: 0 },
    { id: 8, experience: 7, education: "Masters", techScore: 71, interviewScore: 60, age: 57, gender: "Female", biasedPrediction: 0, fairPrediction: 1 },
    { id: 9, experience: 4, education: "Masters", techScore: 56, interviewScore: 99, age: 34, gender: "Male", biasedPrediction: 1, fairPrediction: 1 },
    { id: 10, experience: 10, education: "Masters", techScore: 53, interviewScore: 80, age: 26, gender: "Male", biasedPrediction: 1, fairPrediction: 1 },
    { id: 11, experience: 8, education: "Bachelors", techScore: 41, interviewScore: 86, age: 41, gender: "Male", biasedPrediction: 1, fairPrediction: 1 },
    { id: 12, experience: 6, education: "PhD", techScore: 59, interviewScore: 55, age: 34, gender: "Male", biasedPrediction: 1, fairPrediction: 1 },
  ],
};

export const sensitiveFeatures = ["Gender", "Age"];
