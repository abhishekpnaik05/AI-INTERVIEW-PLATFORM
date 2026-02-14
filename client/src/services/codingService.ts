import api from './api';

export interface CodingQuestion {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases?: { input: string; expectedOutput: string; isHidden?: boolean }[];
}

export interface CodingAttempt {
  id: string;
  questionId: string;
  code: string;
  language: string;
  aiFeedback: string;
  score: number | null;
  status: string;
  createdAt: string;
}

export const codingService = {
  async getQuestions(difficulty?: string) {
    const params = difficulty ? { difficulty } : {};
    const { data } = await api.get<{ status: string; results: number; data: { questions: CodingQuestion[] } }>(
      '/coding/questions',
      { params }
    );
    return data.data.questions;
  },

  async getQuestion(id: string) {
    const { data } = await api.get<{ status: string; data: { question: CodingQuestion } }>(
      `/coding/questions/${id}`
    );
    return data.data.question;
  },

  async submitAttempt(questionId: string, code: string, language = 'javascript') {
    const { data } = await api.post<{ status: string; data: { attempt: CodingAttempt } }>(
      '/coding/attempts',
      { questionId, code, language }
    );
    return data.data.attempt;
  },
};
