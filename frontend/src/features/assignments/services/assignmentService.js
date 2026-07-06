// Assignment Service wrapping API calls and providing robust interactive localStorage mock fallback
import api from "@/shared/services/api";

// Lazy initialization check
const ensureInit = async () => {
  if (!localStorage.getItem("lms_assignments")) {
    const { MOCK_ASSIGNMENTS } = await import("../mocks/assignments");
    localStorage.setItem("lms_assignments", JSON.stringify(MOCK_ASSIGNMENTS));
  }
  if (!localStorage.getItem("lms_submissions")) {
    const { MOCK_SUBMISSIONS } = await import("../mocks/submissions");
    localStorage.setItem("lms_submissions", JSON.stringify(MOCK_SUBMISSIONS));
  }
};

const getLocalAssignments = () => {
  return JSON.parse(localStorage.getItem("lms_assignments") || "[]");
};

const saveLocalAssignments = (data) => {
  localStorage.setItem("lms_assignments", JSON.stringify(data));
};

const getLocalSubmissions = () => {
  return JSON.parse(localStorage.getItem("lms_submissions") || "[]");
};

const saveLocalSubmissions = (data) => {
  localStorage.setItem("lms_submissions", JSON.stringify(data));
};

const assignmentService = {
  getCourses: async () => {
    const { MOCK_COURSES } = await import("../mocks/courses");
    return MOCK_COURSES;
  },

  getBatches: async () => {
    const { MOCK_BATCHES } = await import("../mocks/batches");
    return MOCK_BATCHES;
  },

  getAssignments: async (config) => {
    await ensureInit();
    try {
      const response = await api.get("/assignments", config);
      return response.data.data;
    } catch (err) {
      console.warn("Backend assignments API failed, falling back to local storage:", err.message);
      return getLocalAssignments();
    }
  },

  getAssignmentById: async (id, config) => {
    await ensureInit();
    try {
      const response = await api.get(`/assignments/${id}`, config);
      return response.data.data;
    } catch (err) {
      console.warn(`Backend assignment ${id} API failed, falling back to local storage:`, err.message);
      return getLocalAssignments().find(a => a.id === id);
    }
  },

  createAssignment: async (assignment, config) => {
    await ensureInit();
    try {
      const response = await api.post("/assignments", assignment, config);
      return response.data.data;
    } catch (err) {
      console.warn("Backend create assignment API failed, falling back to local storage:", err.message);
      const assignments = getLocalAssignments();
      const newAssignment = {
        ...assignment,
        id: "a_" + Date.now(),
        status: assignment.status || "Active"
      };
      assignments.unshift(newAssignment);
      saveLocalAssignments(assignments);
      return newAssignment;
    }
  },

  updateAssignment: async (id, assignment, config) => {
    await ensureInit();
    try {
      const response = await api.put(`/assignments/${id}`, assignment, config);
      return response.data.data;
    } catch (err) {
      console.warn(`Backend update assignment ${id} API failed, falling back to local storage:`, err.message);
      const assignments = getLocalAssignments();
      const index = assignments.findIndex(a => a.id === id);
      if (index !== -1) {
        assignments[index] = { ...assignments[index], ...assignment };
        saveLocalAssignments(assignments);
        return assignments[index];
      }
      return null;
    }
  },

  deleteAssignment: async (id, config) => {
    await ensureInit();
    try {
      const response = await api.delete(`/assignments/${id}`, config);
      return response.data.data;
    } catch (err) {
      console.warn(`Backend delete assignment ${id} API failed, falling back to local storage:`, err.message);
      const assignments = getLocalAssignments();
      const updated = assignments.filter(a => a.id !== id);
      saveLocalAssignments(updated);
      return true;
    }
  },

  getSubmissions: async (config) => {
    await ensureInit();
    try {
      const response = await api.get("/submissions", config);
      return response.data.data;
    } catch (err) {
      console.warn("Backend submissions API failed, falling back to local storage:", err.message);
      return getLocalSubmissions();
    }
  },

  getSubmissionById: async (id, config) => {
    await ensureInit();
    try {
      const response = await api.get(`/submissions/${id}`, config);
      return response.data.data;
    } catch (err) {
      console.warn(`Backend submission ${id} API failed, falling back to local storage:`, err.message);
      return getLocalSubmissions().find(s => s.id === id);
    }
  },

  getStudentSubmissions: async (studentId, config) => {
    await ensureInit();
    try {
      const response = await api.get(`/student/${studentId}/submissions`, config);
      return response.data.data;
    } catch (err) {
      console.warn(`Backend student ${studentId} submissions API failed, falling back to local storage:`, err.message);
      return getLocalSubmissions().filter(s => s.studentId === studentId);
    }
  },

  gradeSubmission: async (id, gradeData, config) => {
    await ensureInit();
    try {
      const response = await api.post(`/submissions/${id}/grade`, gradeData, config);
      return response.data.data;
    } catch (err) {
      console.warn(`Backend grade submission ${id} API failed, falling back to local storage:`, err.message);
      const submissions = getLocalSubmissions();
      const index = submissions.findIndex(s => s.id === id);
      if (index !== -1) {
        const submission = submissions[index];
        const marks = Number(gradeData.score);
        
        // Calculate grade letter based on score out of 100
        let gradeLetter = "F";
        if (marks >= 90) gradeLetter = "A";
        else if (marks >= 80) gradeLetter = "B";
        else if (marks >= 70) gradeLetter = "C";
        else if (marks >= 60) gradeLetter = "D";

        submissions[index] = {
          ...submission,
          status: "Graded",
          score: marks,
          feedback: gradeData.feedback,
          privateNotes: gradeData.privateNotes,
          evaluator: gradeData.evaluator || "Dr. Sarah Jenkins",
          evaluatedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        };
        saveLocalSubmissions(submissions);

        // Also update assignment status in assignments list if needed
        const assignments = getLocalAssignments();
        const aIndex = assignments.findIndex(a => a.id === submission.assignmentId);
        if (aIndex !== -1 && assignments[aIndex].status === "Active") {
          // If we had no other pending, mark assignment as completed
          const remainingPending = submissions.filter(s => s.assignmentId === submission.assignmentId && s.status === "Submitted" && s.id !== id);
          if (remainingPending.length === 0) {
            assignments[aIndex].status = "Completed";
            saveLocalAssignments(assignments);
          }
        }

        return submissions[index];
      }
      return null;
    }
  },

  submitAssignment: async (studentId, submissionData, config) => {
    await ensureInit();
    try {
      const response = await api.post(`/student/${studentId}/submit`, submissionData, config);
      return response.data.data;
    } catch (err) {
      console.warn(`Backend student ${studentId} submit API failed, falling back to local storage:`, err.message);
      const submissions = getLocalSubmissions();
      const newSubmission = {
        id: "sub_" + Date.now(),
        assignmentId: submissionData.assignmentId,
        assignmentTitle: submissionData.assignmentTitle,
        studentId: studentId,
        studentName: submissionData.studentName || "Jane Doe",
        studentAvatar: "",
        batch: submissionData.batch || "Batch 2023-A",
        submittedAt: "Just now",
        submittedDateRaw: new Date().toISOString(),
        status: "Submitted",
        attempt: Number(submissionData.attempt || 1),
        files: submissionData.files || [],
        studentNote: submissionData.studentNote || "",
        score: null,
        feedback: "",
        privateNotes: "",
        evaluator: "",
        evaluatedDate: ""
      };
      
      // Remove any older submission status for the same assignment and student to simulate update
      const updated = submissions.filter(s => !(s.studentId === studentId && s.assignmentId === submissionData.assignmentId));
      updated.unshift(newSubmission);
      saveLocalSubmissions(updated);

      // Update student assignment list status to "Submitted"
      const assignments = getLocalAssignments();
      const aIndex = assignments.findIndex(a => a.id === submissionData.assignmentId);
      if (aIndex !== -1) {
        assignments[aIndex].status = "Submitted";
        saveLocalAssignments(assignments);
      }

      return newSubmission;
    }
  }
};

export default assignmentService;
