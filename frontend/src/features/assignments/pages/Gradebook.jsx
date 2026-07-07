import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { Button } from "@/shared/components/ui/button";
import { Download } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import SearchToolbar from "../components/SearchToolbar";
import GradebookTable from "../components/GradebookTable";

export default function Gradebook() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, average: "N/A" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    assignmentService.getSubmissions().then(data => setSubmissions(data || []));
    assignmentService.getBatches().then(data => setBatches(data || []));
    assignmentService.getGradebookStats().then(data => {
      if (data) setStats(data);
    });
  }, []);

  const handleExport = useCallback(() => {
    const headers = ["Student", "Batch", "Assignment", "Marks", "Status", "Date"];
    const rows = submissions.map(s => [
      s.studentName, s.batch, s.assignmentTitle,
      s.score !== null ? `${s.score}/100` : "--/100", s.status, s.submittedAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `LMS_Gradebook_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [submissions]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      setSubmissions(prev => prev.filter(s => s.id !== deleteTarget));
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  // Filter logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBatch = selectedBatch === "All Batches" || s.batch === selectedBatch;
      let matchesStatus = true;
      if (selectedStatus !== "All Statuses") {
        if (selectedStatus === "Graded") matchesStatus = s.status === "Graded";
        else if (selectedStatus === "Pending") matchesStatus = s.status === "Submitted" || s.status === "Pending";
        else if (selectedStatus === "Late") matchesStatus = (s.submittedAt && s.submittedAt.toLowerCase().includes("late")) || s.status === "Revision Needed";
      }
      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [submissions, searchQuery, selectedBatch, selectedStatus]);

  const handleRowClick = useCallback((s) => {
    const isSubmitted = s.status === "Submitted" || s.status === "Pending";
    if (isSubmitted || s.status === "Graded") {
      navigate(`/trainer/assignments/review/${s.id}`);
    }
  }, [navigate]);

  const handleEdit = useCallback((s) => {
    const isSubmitted = s.status === "Submitted" || s.status === "Pending";
    if (isSubmitted || s.status === "Graded") {
      navigate(`/trainer/assignments/review/${s.id}`);
    }
  }, [navigate]);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full space-y-6 animate-fadeIn pb-12">
        {/* Page Header */}
        <PageHeader
          title="Gradebook"
          subtitle="Review submission details, grade assignments, and track class performance."
        >
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm h-9"
          >
            <Download size={14} /> Export CSV
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Submissions" value={stats.total} subtitle="+12% this week" className="bg-white" />
          <StatsCard label="Needs Grading" value={<span className="text-rose-600">{stats.pending}</span>} subtitle="Across current batches" className="bg-white" />
          <StatsCard label="Average Score" value={stats.average} subtitle={<span className="text-[#01AC9F] font-semibold">B Grade Average</span>} className="bg-white" />
          <StatsCard label="Next Deadline" value="Java Basics Part 2" subtitle="Tomorrow, 11:59 PM" variant="accent" className="bg-[#6C1D5F]" />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          <SearchToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search students or assignments..."
          >
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-650 h-8 font-semibold w-40">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Batches">All Batches</SelectItem>
                {batches.map(b => <SelectItem key={b.id} value={b.title}>{b.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-650 h-8 font-semibold w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Graded">Graded</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
              </SelectContent>
            </Select>
          </SearchToolbar>

          <GradebookTable
            submissions={filteredSubmissions}
            onRowClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteTarget(id)}
          />
        </div>
      </div>

      <DeleteDialog
        show={!!deleteTarget}
        title="Delete Gradebook Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
}
