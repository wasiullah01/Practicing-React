export type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type AnswerRecord = {
  questionId: number;
  question: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
};