import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { Plus } from "lucide-react";

import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import AssignmentTable from "../components/AssignmentTable";

export default function ManagerAssignmentDashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter states
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    assignmentService.getAssignments().then(data => setAssignments(data || []));
    assignmentService.getSubmissions().then(data => setSubmissions(data || []));
    assignmentService.getCourses().then(data => setCourses(data || []));
    assignmentService.getBatches().then(data => setBatches(data || []));
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteTarget) {
      await assignmentService.deleteAssignment(deleteTarget);
      setAssignments(prev => prev.filter(a => a.id !== deleteTarget));
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  const handleResetFilters = useCallback(() => {
    setSelectedCourse("All Courses");
    setSelectedBatch("All Batches");
    setSelectedStatus("All Statuses");
    setSelectedDate("");
  }, []);

  // Compute Stats
  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter(a => a.status === "Active").length;
    const pendingReview = submissions.filter(s => s.status === "Submitted" || s.status === "Pending").length;
    const reviewed = submissions.filter(s => s.status === "Graded").length;
    const overdue = assignments.filter(a => a.status === "Overdue" || (a.dueDate && new Date(a.dueDate) < new Date() && a.status === "Active")).length;
    return { total, active, pendingReview, reviewed, overdue };
  }, [assignments, submissions]);

  // Filtered list
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesCourse = selectedCourse === "All Courses" || a.course === selectedCourse;
      const matchesBatch = selectedBatch === "All Batches" || a.batch === selectedBatch;
      const matchesStatus = selectedStatus === "All Statuses" || a.status === selectedStatus;
      const matchesDate = !selectedDate || (a.dueDate && a.dueDate.includes(selectedDate));
      return matchesCourse && matchesBatch && matchesStatus && matchesDate;
    });
  }, [assignments, selectedCourse, selectedBatch, selectedStatus, selectedDate]);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full space-y-6 animate-fadeIn pb-12">
        {/* Page Header */}
        <PageHeader
          title="Assignment Dashboard"
          subtitle="Manage curricula coursework, assignments, and review learner submissions."
        >
          <button
            onClick={() => navigate("/trainer/assignments/create")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium text-white bg-[#6C1D5F] hover:bg-[#4A1E47] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={14} /> Create Assignment
          </button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard label="Total" value={stats.total} accentColor="#6C1D5F" />
          <StatsCard label="Active" value={stats.active} accentColor="#01AC9F" />
          <StatsCard label="Pending Review" value={stats.pendingReview} accentColor="#f59e0b" />
          <StatsCard label="Reviewed" value={stats.reviewed} accentColor="#6366f1" />
          <StatsCard
            label="Overdue"
            value={<span className="text-rose-650">{stats.overdue}</span>}
            accentColor="#e11d48"
            className="bg-rose-50/50 border-rose-100"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1.5">Course</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white text-[13px] px-3 py-2 outline-none focus:border-[#6C1D5F] text-slate-700"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option>All Courses</option>
                {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1.5">Batch</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white text-[13px] px-3 py-2 outline-none focus:border-[#6C1D5F] text-slate-700"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option>All Batches</option>
                {batches.map(b => <option key={b.id} value={b.title}>{b.title}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1.5">Status</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white text-[13px] px-3 py-2 outline-none focus:border-[#6C1D5F] text-slate-700"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1.5">Due Date</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white text-[13px] px-3 py-1.5 outline-none focus:border-[#6C1D5F] text-slate-700"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <button
              onClick={handleResetFilters}
              className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-5 py-2 rounded-lg text-[12px] font-bold border border-slate-200/80 transition-colors whitespace-nowrap cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <AssignmentTable
          assignments={filteredAssignments}
          onDelete={(id) => setDeleteTarget(id)}
        />
      </div>

      <DeleteDialog
        show={!!deleteTarget}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
}
