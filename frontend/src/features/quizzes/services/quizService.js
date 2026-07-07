import api from "@/shared/services/api";

const quizService = {
  getQuizzes: async (studentId, config) => {
    const url = studentId ? `/quizzes?studentId=${studentId}` : "/quizzes";
    const response = await api.get(url, config);
    return response.data.data;
  },

  getQuizById: async (id, config) => {
    const response = await api.get(`/quizzes/${id}`, config);
    return response.data.data;
  },

  getQuizQuestionsForStudent: async (id, config) => {
    const response = await api.get(`/quizzes/${id}/questions`, config);
    return response.data.data;
  },

  createQuiz: async (quiz, config) => {
    const response = await api.post("/quizzes", quiz, config);
    return response.data.data;
  },

  updateQuiz: async (id, updatedData, config) => {
    const response = await api.put(`/quizzes/${id}`, updatedData, config);
    return response.data.data;
  },

  deleteQuiz: async (id, config) => {
    const response = await api.delete(`/quizzes/${id}`, config);
    return response.data.data;
  },

  getQuizResults: async (quizId, config) => {
    const response = await api.get(`/quizzes/${quizId}/results`, config);
    return response.data.data;
  },

  getStudentResult: async (quizId, studentId, config) => {
    const response = await api.get(`/quizzes/${quizId}/result?studentId=${studentId}`, config);
    return response.data.data;
  },

  submitQuiz: async (quizId, submissionData, config) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, submissionData, config);
    return response.data.data;
  },

  importQuestions: async (quizId, questions, config) => {
    const response = await api.post(`/quizzes/${quizId}/import`, questions, config);
    return response.data.data;
  },

  getQuizStats: async (config) => {
    const response = await api.get("/quizzes/stats", config);
    return response.data.data;
  },

  getStudentQuizStats: async (studentId, config) => {
    const response = await api.get(`/quizzes/student/${studentId}/stats`, config);
    return response.data.data;
  }
};

export default quizService;
