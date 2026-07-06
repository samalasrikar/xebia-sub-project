import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import assignmentService from "../services/assignmentService";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Award,
  Send,
  Eye
} from "lucide-react";

export default function StudentAssignmentDashboard() {
  const navigate = useNavigate();
  const [rawAssignments, setRawAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // Student ID hardcoded to s4 (Jane Doe) or s1 (Alex Mercer) to match designs
  const studentId = "s4";

  useEffect(() => {
    // For students, let's fetch both all assignments and student's submissions to reconcile status
    Promise.all([
      assignmentService.getAssignments(),
      assignmentService.getStudentSubmissions(studentId)
    ]).then(([allAs, studentSubs]) => {
      setRawAssignments(allAs || []);
      setSubmissions(studentSubs || []);
    });
  }, []);

  // Reconcile assignments status with student submissions
  const assignments = useMemo(() => {
    const reconciled = rawAssignments.map(a => {
      // Find if this student has a submission for this assignment
      const sub = submissions.find(s => s.assignmentId === a.id);
      
      let displayStatus = a.status; // Default
      let score = null;
      let submissionId = null;

      if (sub) {
        submissionId = sub.id;
        if (sub.status === "Graded") {
          displayStatus = "Reviewed";
          score = sub.score;
        } else if (sub.status === "Submitted") {
          displayStatus = "Submitted";
        } else if (sub.status === "Revision Needed") {
          displayStatus = "Needs Revision";
        }
      } else {
        // Re-evaluate if overdue based on date
        // For mockup simplicity, let's preserve the default status
        if (a.status === "Active" || a.status === "Pending") {
          displayStatus = "Pending";
        }
        if (a.id === "a5") {
          displayStatus = "Overdue"; // Ensure hardcoded design matches
        }
      }

      return {
        ...a,
        displayStatus,
        score,
        submissionId
      };
    });
    // Filter out draft assignments (not visible to students)
    return reconciled.filter(a => a.status !== "Draft");
  }, [rawAssignments, submissions]);

  // Compute Stats
  const stats = useMemo(() => {
    const pending = assignments.filter(a => a.displayStatus === "Pending" || a.displayStatus === "Needs Revision").length;
    const submitted = assignments.filter(a => a.displayStatus === "Submitted").length;
    const reviewed = assignments.filter(a => a.displayStatus === "Reviewed").length;
    const overdue = assignments.filter(a => a.displayStatus === "Overdue").length;
    return { pending, submitted, reviewed, overdue };
  }, [assignments]);

  return (
    <div className="max-w-[1100px] w-full mx-auto px-6 md:px-8 py-8 space-y-6 animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Assignment Dashboard</h1>
          <p className="text-[13px] text-slate-400 mt-1">Manage and track your coursework progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-650 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={13} /> Filter
          </button>
          <button className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-650 hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowUpDown size={13} /> Sort
          </button>
        </div>
      </div>

      {/* ── Stats Bento Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-[#FF6200] shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
            <Clock size={16} className="text-[#FF6200]" />
          </div>
          <div className="text-[26px] font-black text-slate-850 leading-none">{stats.pending}</div>
        </div>
        {/* Submitted */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-[#6C1D5F] shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</span>
            <Send size={16} className="text-[#6C1D5F]" />
          </div>
          <div className="text-[26px] font-black text-slate-850 leading-none">{stats.submitted}</div>
        </div>
        {/* Reviewed */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-emerald-500 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviewed</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <div className="text-[26px] font-black text-slate-850 leading-none">{stats.reviewed}</div>
        </div>
        {/* Overdue */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-rose-500 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue</span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="text-[26px] font-black text-slate-850 leading-none">{stats.overdue}</div>
        </div>
      </div>

      {/* ── Assignments Card List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((a) => {
          let accentBorder = "border-l-slate-200";
          let badgeStyle = "bg-slate-100 text-slate-600 border-slate-200";
          let showScore = false;

          if (a.displayStatus === "Overdue") {
            accentBorder = "border-l-rose-500 hover:border-rose-500";
            badgeStyle = "bg-rose-50 text-rose-700 border-rose-100";
          } else if (a.displayStatus === "Pending") {
            accentBorder = "border-l-[#FF6200] hover:border-[#6C1D5F]";
            badgeStyle = "bg-orange-50 text-orange-700 border-orange-100";
          } else if (a.displayStatus === "Needs Revision") {
            accentBorder = "border-l-rose-500 hover:border-rose-500";
            badgeStyle = "bg-rose-50 text-rose-700 border-rose-100";
          } else if (a.displayStatus === "Submitted") {
            accentBorder = "border-l-[#6C1D5F] hover:border-[#6C1D5F]";
            badgeStyle = "bg-[#6C1D5F]/10 text-[#6C1D5F] border-[#6C1D5F]/20";
          } else if (a.displayStatus === "Reviewed") {
            accentBorder = "border-l-emerald-500 hover:border-emerald-500";
            badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
            showScore = true;
          }

          return (
            <div
              key={a.id}
              className={`bg-white rounded-2xl shadow-sm border border-slate-200 border-l-4 ${accentBorder} flex flex-col overflow-hidden hover:shadow-md transition-all duration-300 group`}
            >
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider border ${badgeStyle}`}>
                    {a.displayStatus}
                  </span>
                  <span className={`text-[11px] font-semibold flex items-center gap-1 ${a.displayStatus === "Overdue" ? "text-rose-500" : "text-slate-400"}`}>
                    <Calendar size={12} />
                    {a.dueDate}
                  </span>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-800 group-hover:text-[#6C1D5F] transition-colors leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-[12px] text-slate-400 mt-1">{a.course}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {showScore ? "Score" : "Max Marks"}
                    </span>
                    <span className={`text-[12.5px] font-bold ${showScore ? "text-emerald-600" : "text-slate-700"}`}>
                      {showScore ? `${a.score} / ${a.maxMarks}` : a.maxMarks}
                    </span>
                  </div>

                  {a.displayStatus === "Pending" ? (
                    <button
                      onClick={() => navigate(`/student/assignments/${a.id}`)}
                      className="h-8 px-3.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Start Draft
                    </button>
                  ) : a.displayStatus === "Needs Revision" ? (
                    <button
                      onClick={() => navigate(`/student/assignments/${a.id}/submissions`)}
                      className="h-8 px-3.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Resubmit
                    </button>
                  ) : a.displayStatus === "Reviewed" ? (
                    <button
                      onClick={() => navigate(`/student/assignments/${a.id}/result`)}
                      className="h-8 px-3.5 bg-white border border-[#6C1D5F] text-[#6C1D5F] hover:bg-[#6C1D5F]/5 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Feedback
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/student/assignments/${a.id}`)}
                      className="h-8 px-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
