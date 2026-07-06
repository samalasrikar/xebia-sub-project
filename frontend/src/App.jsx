import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "@/app/layouts/StudentLayout";

// Lazy-loaded Assignments Feature Pages
const CreateAssignment = lazy(() => import("@/features/assignments/pages/CreateAssignment"));
const Gradebook = lazy(() => import("@/features/assignments/pages/Gradebook"));
const ManagerAssignmentDashboard = lazy(() => import("@/features/assignments/pages/ManagerAssignmentDashboard"));
const SubmissionReview = lazy(() => import("@/features/assignments/pages/SubmissionReview"));
const StudentAssignmentDashboard = lazy(() => import("@/features/assignments/pages/StudentAssignmentDashboard"));
const StudentAssignmentDetails = lazy(() => import("@/features/assignments/pages/StudentAssignmentDetails"));
const StudentMySubmissions = lazy(() => import("@/features/assignments/pages/StudentMySubmissions"));
const StudentAssignmentResult = lazy(() => import("@/features/assignments/pages/StudentAssignmentResult"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center p-12 min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#6C1D5F]/20 border-t-[#6C1D5F] animate-spin"></div>
        <p className="text-[12.5px] text-slate-405 font-medium">Loading page...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Redirect Root to Manager Assignments */}
        <Route path="/" element={<Navigate to="/trainer/assignments" replace />} />

        {/* Assignments Manager / Trainer Routes */}
        <Route path="/trainer/assignments" element={<ManagerAssignmentDashboard />} />
        <Route path="/trainer/assignments/create" element={<CreateAssignment />} />
        <Route path="/trainer/assignments/edit/:id" element={<CreateAssignment />} />
        <Route path="/trainer/assignments/review/:submissionId" element={<SubmissionReview />} />
        <Route path="/trainer/gradebook" element={<Gradebook />} />

        {/* Student Portal (using student layout) */}
        <Route path="/student" element={<StudentLayout />}>
          {/* Redirect student root to assignments list */}
          <Route index element={<Navigate to="assignments" replace />} />
          <Route path="assignments" element={<StudentAssignmentDashboard />} />
          <Route path="assignments/:id" element={<StudentAssignmentDetails />} />
          <Route path="assignments/:id/submissions" element={<StudentMySubmissions />} />
          <Route path="assignments/:id/result" element={<StudentAssignmentResult />} />
        </Route>

        {/* Fallback to Manager Assignments */}
        <Route path="*" element={<Navigate to="/trainer/assignments" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;