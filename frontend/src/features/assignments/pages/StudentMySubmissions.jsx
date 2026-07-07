import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assignmentService from "../services/assignmentService";
import { Calendar } from "lucide-react";

import Breadcrumbs from "../components/Breadcrumbs";
import SubmissionCard from "../components/SubmissionCard";
import PerformanceOverview from "../components/PerformanceOverview";
import SubmissionFilters from "../components/SubmissionFilters";

export default function StudentMySubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filterState, setFilterState] = useState("All");

  const studentId = "s4";

  useEffect(() => {
    Promise.all([
      assignmentService.getAssignmentById(id),
      assignmentService.getStudentSubmissions(studentId)
    ]).then(([asData, subData]) => {
      setAssignment(asData);
      const filtered = subData.filter(s => s.assignmentId === id);
      
      setSubmissions(filtered);
    });
  }, [id]);

  const filteredSubs = useMemo(() => {
    return submissions.filter(s => {
      if (filterState === "All") return true;
      if (filterState === "Graded") return s.status === "Graded";
      if (filterState === "Pending Review") return s.status === "Submitted" || s.status === "Pending";
      if (filterState === "Needs Revision") return s.status === "Revision Needed";
      return true;
    });
  }, [submissions, filterState]);

  const handleNavigateResubmit = useCallback(() => {
    if (assignment) navigate(`/student/assignments/${assignment.id}`);
  }, [assignment, navigate]);

  const handleNavigateDetails = useCallback(() => {
    if (assignment) navigate(`/student/assignments/${assignment.id}`);
  }, [assignment, navigate]);

  const handleNavigateResult = useCallback(() => {
    if (assignment) navigate(`/student/assignments/${assignment.id}/result`);
  }, [assignment, navigate]);

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading submission history...
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Dashboard", to: "/student" },
    { label: "Assignments", to: "/student/assignments" },
    { label: "Submissions" },
  ];

  return (
    <div className="max-w-[1050px] w-full mx-auto px-6 md:px-8 py-8 space-y-6 animate-fadeIn pb-12">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Submission History</h1>
            <p className="text-[13px] text-slate-400 mt-1">{assignment.title}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-650 px-4 py-2 rounded-xl text-[12px] font-bold border border-slate-200 shrink-0">
            <Calendar size={14} />
            <span>Due date: {assignment.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Submissions Cards */}
        <div className="lg:col-span-8 space-y-5">
          {filteredSubs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-slate-400">
              No submissions match the selected filter.
            </div>
          ) : (
            filteredSubs.map((sub) => (
              <SubmissionCard
                key={sub.id}
                sub={sub}
                assignment={assignment}
                onNavigateResubmit={handleNavigateResubmit}
                onNavigateDetails={handleNavigateDetails}
                onNavigateResult={handleNavigateResult}
              />
            ))
          )}
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="lg:col-span-4 space-y-6">
          <PerformanceOverview />
          <SubmissionFilters filterState={filterState} onFilterChange={setFilterState} />
        </div>
      </div>
    </div>
  );
}
