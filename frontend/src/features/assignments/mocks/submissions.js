export const MOCK_SUBMISSIONS = [
  {
    id: "sub1",
    assignmentId: "a1",
    assignmentTitle: "Microservices Architecture Lab",
    studentId: "s1",
    studentName: "Alex Mercer",
    studentAvatar: "",
    batch: "B-2024-Q1",
    submittedAt: "2 hours ago",
    submittedDateRaw: "2026-07-06T12:08:18Z",
    status: "Submitted",
    attempt: 1,
    files: [
      { name: "architecture_proposal.pdf", size: "2.4 MB", type: "pdf" }
    ],
    studentNote: "Scalability aspects are detailed in the proposal PDF.",
    score: null,
    feedback: "",
    privateNotes: "",
    evaluator: "",
    evaluatedDate: ""
  },
  {
    id: "sub9",
    assignmentId: "a9",
    assignmentTitle: "Database Normalization Quiz",
    studentId: "s4",
    studentName: "Jane Doe",
    studentAvatar: "",
    batch: "Batch 2023-A",
    submittedAt: "Oct 24, 2026, 14:30 EST",
    submittedDateRaw: "2026-10-24T14:30:00Z",
    status: "Graded",
    attempt: 1,
    files: [
      { name: "normalization_answers.pdf", size: "2.4 MB", type: "pdf" }
    ],
    studentNote: "Normalized schema up to BCNF.",
    score: 85,
    feedback: "Overall, this is a solid submission that meets the core requirements of the prompt. The schema decompositions are accurate.\n\nStrengths:\n- Clean normal forms.\n- Solid documentation.\n\nAreas for Improvement:\n- Consider dependencies key closures detail.",
    privateNotes: "Well done.",
    evaluator: "Dr. Sarah Jenkins",
    evaluatedDate: "Oct 26, 2026"
  }
];
