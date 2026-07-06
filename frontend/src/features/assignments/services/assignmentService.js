// Assignment Service wrapping API calls
import api from "@/shared/services/api";

const assignmentService = {
  getCourses: async (config) => {
    const response = await api.get("/courses", config);
    return response.data.data;
  },

  getBatches: async (config) => {
    const response = await api.get("/batches", config);
    return response.data.data;
  },

  getAssignments: async (config) => {
    const response = await api.get("/assignments", config);
    return response.data.data;
  },

  getAssignmentById: async (id, config) => {
    const response = await api.get(`/assignments/${id}`, config);
    return response.data.data;
  },

  createAssignment: async (assignment, config) => {
    const response = await api.post("/assignments", assignment, config);
    return response.data.data;
  },

  updateAssignment: async (id, assignment, config) => {
    const response = await api.put(`/assignments/${id}`, assignment, config);
    return response.data.data;
  },

  deleteAssignment: async (id, config) => {
    const response = await api.delete(`/assignments/${id}`, config);
    return response.data.data;
  },

  getSubmissions: async (config) => {
    const response = await api.get("/submissions", config);
    return response.data.data;
  },

  getSubmissionById: async (id, config) => {
    const response = await api.get(`/submissions/${id}`, config);
    return response.data.data;
  },

  getStudentSubmissions: async (studentId, config) => {
    const response = await api.get(`/student/${studentId}/submissions`, config);
    return response.data.data;
  },

  gradeSubmission: async (id, gradeData, config) => {
    const response = await api.post(`/submissions/${id}/grade`, gradeData, config);
    return response.data.data;
  },

  submitAssignment: async (studentId, submissionData, config) => {
    const response = await api.post(`/student/${studentId}/submit`, submissionData, config);
    return response.data.data;
  }
};

export default assignmentService;
