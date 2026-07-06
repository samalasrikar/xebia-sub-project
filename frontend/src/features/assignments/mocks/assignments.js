export const MOCK_ASSIGNMENTS = [
  {
    id: "a1",
    title: "Microservices Architecture Lab",
    course: "Cloud Native Engineering",
    courseId: "c1",
    batch: "B-2024-Q1",
    batchId: "b1",
    scope: "Entire Course",
    dueDate: "Oct 24, 2026",
    status: "Active",
    maxMarks: 100,
    weightage: "25% of Final Grade",
    attemptsAllowed: "1 / 2",
    description: "In this assignment, you will architect and implement a microservices architecture. Focus on load balancing and message queues.",
    instructions: "1. Expose necessary services.\n2. Maintain consistent state synchronization.\n3. Verify your docker-compose environment compiles.",
    attachments: [
      { name: "Architecture_Diagram.pdf", size: "2.4 MB", type: "pdf" }
    ],
    submissionFormats: ["file"]
  },
  {
    id: "a5",
    title: "Advanced Algorithm Analysis",
    course: "Cloud Native Engineering",
    courseId: "c1",
    batch: "Batch 2023-A",
    batchId: "b2",
    scope: "Entire Course",
    dueDate: "Yesterday, 11:59 PM",
    status: "Overdue",
    maxMarks: 100,
    weightage: "30% of Final Grade",
    attemptsAllowed: "1 / 1",
    description: "Analyze the time and space complexity of sorting algorithms.",
    instructions: "Provide mathematical proofs for your big-O bounds.",
    attachments: [],
    submissionFormats: ["file"]
  },
  {
    id: "a9",
    title: "Database Normalization Quiz",
    course: "Java Full Stack",
    courseId: "c2",
    batch: "Batch 2023-A",
    batchId: "b2",
    scope: "Entire Course",
    dueDate: "Oct 15, 2026",
    status: "Reviewed",
    maxMarks: 50,
    weightage: "15% of Final Grade",
    attemptsAllowed: "1 / 1",
    description: "Normalize a given denormalized schema from 1NF to 3NF.",
    instructions: "Explain decomposition steps.",
    attachments: [],
    submissionFormats: ["file"]
  }
];
