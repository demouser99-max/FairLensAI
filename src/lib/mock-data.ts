export interface BiasMetric {
  group: string;
  selectionRate: number;
  truePositiveRate: number;
  falsePositiveRate: number;
}

export interface ShapFeature {
  feature: string;
  importance: number;
  direction: "positive" | "negative";
}

export interface AnalysisResult {
  accuracy: number;
  fairAccuracy: number;
  biasMetrics: {
    before: BiasMetric[];
    after: BiasMetric[];
  };
  demographicParity: { before: number; after: number };
  equalOpportunity: { before: number; after: number };
  shapValues: ShapFeature[];
  totalCandidates: number;
  biasedDecisions: number;
  correctedDecisions: number;
}

export const sampleAnalysis: AnalysisResult = {
  accuracy: 0.847,
  fairAccuracy: 0.831,
  biasMetrics: {
    before: [
      { group: "Male", selectionRate: 0.72, truePositiveRate: 0.81, falsePositiveRate: 0.15 },
      { group: "Female", selectionRate: 0.43, truePositiveRate: 0.59, falsePositiveRate: 0.22 },
      { group: "Non-binary", selectionRate: 0.38, truePositiveRate: 0.52, falsePositiveRate: 0.25 },
    ],
    after: [
      { group: "Male", selectionRate: 0.64, truePositiveRate: 0.76, falsePositiveRate: 0.14 },
      { group: "Female", selectionRate: 0.61, truePositiveRate: 0.73, falsePositiveRate: 0.16 },
      { group: "Non-binary", selectionRate: 0.59, truePositiveRate: 0.71, falsePositiveRate: 0.17 },
    ],
  },
  demographicParity: { before: 0.34, after: 0.05 },
  equalOpportunity: { before: 0.29, after: 0.05 },
  shapValues: [
    { feature: "years_experience", importance: 0.42, direction: "positive" },
    { feature: "education_level", importance: 0.28, direction: "positive" },
    { feature: "technical_score", importance: 0.23, direction: "positive" },
    { feature: "gender", importance: 0.19, direction: "negative" },
    { feature: "age_group", importance: 0.14, direction: "negative" },
    { feature: "university_tier", importance: 0.11, direction: "positive" },
    { feature: "zip_code", importance: 0.09, direction: "negative" },
    { feature: "interview_score", importance: 0.31, direction: "positive" },
  ],
  totalCandidates: 2847,
  biasedDecisions: 412,
  correctedDecisions: 389,
};

export const geminiExplanation = `### Bias Analysis Summary

The hiring model shows **significant gender-based bias**. Female candidates are selected at a rate 40% lower than male candidates, despite comparable qualifications.

**Key Findings:**
- **Gender** has a SHAP importance of 0.19, meaning it materially influences decisions — this should be near zero for a fair model
- The model over-weights **university tier** (0.11), which correlates with socioeconomic background
- **Zip code** (0.09) acts as a proxy for race/ethnicity in many regions

**After applying Fairlearn's ExponentiatedGradient mitigation:**
- Demographic parity gap dropped from **34% → 5%**
- Equal opportunity gap dropped from **29% → 5%**
- Model accuracy decreased only marginally (84.7% → 83.1%), a worthwhile tradeoff

**Recommendation:** Deploy the mitigated model. The 1.6% accuracy reduction eliminates systemic discrimination against 412 candidates.`;

export const sampleDatasetPreview = [
  { id: 1, name: "Priya S.", experience: 5, education: "Masters", techScore: 82, gender: "Female", prediction: "Rejected", fairPrediction: "Selected" },
  { id: 2, name: "Rahul M.", experience: 3, education: "Bachelors", techScore: 71, gender: "Male", prediction: "Selected", fairPrediction: "Selected" },
  { id: 3, name: "Alex T.", experience: 7, education: "PhD", techScore: 91, gender: "Non-binary", prediction: "Rejected", fairPrediction: "Selected" },
  { id: 4, name: "Sneha K.", experience: 4, education: "Masters", techScore: 78, gender: "Female", prediction: "Rejected", fairPrediction: "Selected" },
  { id: 5, name: "Arjun P.", experience: 2, education: "Bachelors", techScore: 65, gender: "Male", prediction: "Selected", fairPrediction: "Selected" },
  { id: 6, name: "Jordan L.", experience: 6, education: "Masters", techScore: 85, gender: "Non-binary", prediction: "Rejected", fairPrediction: "Selected" },
];
