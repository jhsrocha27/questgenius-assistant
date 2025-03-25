
export type QuestionType = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  alternativeExplanations?: string[]; // Explicações para cada alternativa
};
