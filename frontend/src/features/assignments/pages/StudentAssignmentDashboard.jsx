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

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function StudentAssignmentDashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({ pending: 0, submitted: 0, reviewed: 0, overdue: 0, lateSubmitted: 0 });
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  
  // Student ID hardcoded to s4 (Jane Doe) or s1 (Alex Mercer) to match designs
  const studentId = "s4";

  useEffect(() => {
    assignmentService.getAssignments(studentId).then(data => {
      setAssignments(data || []);
    });
    assignmentService.getStudentAssignmentStats(studentId).then(data => {
      if (data) {
        setStats(data);
      }
    });
  }, []);

  const filteredAssignments = useMemo(() => {
    let filtered = [...assignments];

    // FILTER
    if (filterStatus !== "All") {
      filtered = filtered.filter(
        a => a.displayStatus === filterStatus
      );
    }

    // SORT
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (sortOrder === "Newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return filtered;
  }, [assignments, filterStatus, sortOrder]);

  return (
    <div className="max-w-[1100px] w-full mx-auto px-6 md:px-8 py-8 space-y-6 animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Assignment Dashboard</h1>
          <p className="text-[13px] text-slate-400 mt-1">Manage and track your coursework progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] text-slate-650 h-9 font-bold w-36">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Late Submitted">Late Submitted</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] text-slate-650 h-9 font-bold w-28">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Stats Bento Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Pending */}
        <Card className="bg-white rounded-xl border-l-4 border-l-[#FF6200] border-y-slate-200 border-r-slate-200 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
              <Clock size={16} className="text-[#FF6200]" />
            </div>
            <div className="text-[26px] font-black text-slate-850 leading-none">{stats.pending}</div>
          </CardContent>
        </Card>
        {/* Submitted */}
        <Card className="bg-white rounded-xl border-l-4 border-l-[#6C1D5F] border-y-slate-200 border-r-slate-200 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</span>
              <Send size={16} className="text-[#6C1D5F]" />
            </div>
            <div className="text-[26px] font-black text-slate-850 leading-none">{stats.submitted}</div>
          </CardContent>
        </Card>
        {/* Reviewed */}
        <Card className="bg-white rounded-xl border-l-4 border-l-emerald-500 border-y-slate-200 border-r-slate-200 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviewed</span>
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
            <div className="text-[26px] font-black text-slate-850 leading-none">{stats.reviewed}</div>
          </CardContent>
        </Card>
        {/* Overdue */}
        <Card className="bg-white rounded-xl border-l-4 border-l-rose-500 border-y-slate-200 border-r-slate-200 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue</span>
              <AlertTriangle size={16} className="text-rose-500" />
            </div>
            <div className="text-[26px] font-black text-slate-850 leading-none">{stats.overdue}</div>
          </CardContent>
        </Card>
        {/* Late Submitted */}
        <Card className="bg-white rounded-xl border-l-4 border-l-amber-500 border-y-slate-200 border-r-slate-200 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Late Submitted</span>
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
            <div className="text-[26px] font-black text-slate-850 leading-none">{stats.lateSubmitted}</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Assignments Card List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((a) => {
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
            <Card
              key={a.id}
              className={`bg-white rounded-2xl shadow-sm border border-slate-200 border-l-4 ${accentBorder} flex flex-col overflow-hidden hover:shadow-md transition-all duration-300 group`}
            >
              <CardContent className="p-5 flex-1 flex flex-col gap-4 w-full">
                <div className="flex justify-between items-start w-full">
                  <Badge className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider border hover:bg-transparent ${badgeStyle}`}>
                    {a.displayStatus}
                  </Badge>
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
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-404 text-slate-400 font-bold uppercase tracking-wider">
                      {showScore ? "Score" : "Max Marks"}
                    </span>
                    <span className={`text-[12.5px] font-bold ${showScore ? "text-emerald-600" : "text-slate-700"}`}>
                      {showScore ? `${a.score} / ${a.maxMarks}` : a.maxMarks}
                    </span>
                  </div>

                  {a.displayStatus === "Pending" ? (
                    <Button
                      onClick={() => navigate(`/student/assignments/${a.id}`)}
                      className="h-8 px-3.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Start Draft
                    </Button>
                  ) : a.displayStatus === "Needs Revision" ? (
                    <Button
                      onClick={() => navigate(`/student/assignments/${a.id}/submissions`)}
                      className="h-8 px-3.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Resubmit
                    </Button>
                  ) : a.displayStatus === "Reviewed" ? (
                    <Button
                      onClick={() => navigate(`/student/assignments/${a.id}/result`)}
                      variant="outline"
                      className="h-8 px-3.5 bg-white border border-[#6C1D5F] text-[#6C1D5F] hover:bg-[#6C1D5F]/5 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Feedback
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/student/assignments/${a.id}`)}
                      variant="outline"
                      className="h-8 px-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
