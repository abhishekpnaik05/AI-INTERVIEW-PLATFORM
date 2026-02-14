import api from './api';

export interface BehavioralInterview {
  id: string;
  question: string;
  answer: string;
  aiEvaluation: string;
  score: number | null;
  createdAt: string;
}

export const behavioralService = {
  async submit(question: string, answer: string) {
    const { data } = await api.post<{
      status: string;
      data: { interview: BehavioralInterview };
    }>('/behavioral-interviews', { question, answer });
    return data.data.interview;
  },

  async list() {
    const { data } = await api.get<{
      status: string;
      results: number;
      data: { interviews: BehavioralInterview[] };
    }>('/behavioral-interviews');
    return data.data.interviews;
  },
};
