import api from './api';

export interface ResumeAnalysis {
  id: string;
  originalName: string;
  aiAnalysis: string;
  score: number | null;
  createdAt: string;
}

export const resumeService = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append('resume', file);

    const { data } = await api.post<{
      status: string;
      data: { resume: ResumeAnalysis };
    }>('/resume/upload', formData, { timeout: 30000 });
    return data.data.resume;
  },
};
