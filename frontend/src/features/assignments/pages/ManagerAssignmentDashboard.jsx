import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

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
 // Compute Stats
const stats = useMemo(() => {

  // TOTAL ASSIGNMENTS
  const total = assignments.length;

  // ACTIVE ASSIGNMENTS
  // Draft should not come here
  // Completed should not come here
  const active = assignments.filter(a => {

    if (a.status === "Draft") return false;

    if (!a.dueDate) return false;

    const dueDate =
      new Date(a.dueDate).setHours(23, 59, 59, 999);

    return dueDate >= new Date();

  }).length;

  // PENDING REVIEW
  // Comes ONLY from submissions
  const pendingReview = submissions.filter(
    s =>
      s.status === "Submitted" ||
      s.status === "Pending"
  ).length;

  // REVIEWED
  // Comes ONLY from submissions
  const reviewed = submissions.filter(
    s => s.status === "Graded"
  ).length;

  // OVERDUE
  // Assignment deadline passed
  const overdue = assignments.filter(a => {

    if (a.status === "Draft") return false;

    if (!a.dueDate) return false;

    const dueDate =
      new Date(a.dueDate).setHours(23, 59, 59, 999);

    return dueDate < new Date();

  }).length;

  return {
    total,
    active,
    pendingReview,
    reviewed,
    overdue
  };

}, [assignments, submissions]);

  // Filtered list
  // Filtered list
const filteredAssignments = useMemo(() => {

  return assignments
    .map(a => {

      let computedStatus = a.status;

      // Draft remains Draft
      // Otherwise determine using due date
      if (a.status !== "Draft" && a.dueDate) {

        const dueDate =
          new Date(a.dueDate).setHours(23, 59, 59, 999);

        computedStatus =
          dueDate < new Date()
            ? "Completed"
            : "Active";
      }

      return {
        ...a,
        status: computedStatus
      };
    })
    .filter(a => {

      const matchesCourse =
        selectedCourse === "All Courses" ||
        a.course === selectedCourse;

      const selectedBatchObj = batches.find(b => b.id === selectedBatch);
      const matchesBatch =
        selectedBatch === "All Batches" ||
        a.batch === selectedBatch ||
        (selectedBatchObj && (a.batch === selectedBatchObj.name || a.batch === selectedBatchObj.title));

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        a.status === selectedStatus;

      const matchesDate =
        !selectedDate ||
        (
          a.dueDate &&
          new Date(a.dueDate)
            .toLocaleDateString("en-CA") === selectedDate
        );

      return (
        matchesCourse &&
        matchesBatch &&
        matchesStatus &&
        matchesDate
      );
    });

}, [
  assignments,
  selectedCourse,
  selectedBatch,
  selectedStatus,
  selectedDate,
  batches
]);

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
          <StatsCard label="Total Assignments" value={stats.total} accentColor="#6C1D5F" />
          <StatsCard label="Active Assignments" value={stats.active} accentColor="#01AC9F" />
          <StatsCard label="Pending Review Submissions" value={stats.pendingReview} accentColor="#f59e0b" />
          <StatsCard label="Reviewed Submissions" value={stats.reviewed} accentColor="#6366f1" />
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
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full rounded-lg border border-slate-200 bg-white text-[13px] px-3 py-2 outline-none focus:border-[#6C1D5F] text-slate-700 h-9 font-semibold">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Courses">All Courses</SelectItem>
                  {courses.map(c => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1.5">Batch</label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-full rounded-lg border border-slate-200 bg-white text-[13px] px-3 py-2 outline-none focus:border-[#6C1D5F] text-slate-700 h-9 font-semibold">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Batches">All Batches</SelectItem>
                  {batches.map(b => {
                    const bName = b.name || b.title || b.id;
                    return <SelectItem key={b.id} value={b.id}>{bName}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1.5">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full rounded-lg border border-slate-200 bg-white text-[13px] px-3 py-2 outline-none focus:border-[#6C1D5F] text-slate-700 h-9 font-semibold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
