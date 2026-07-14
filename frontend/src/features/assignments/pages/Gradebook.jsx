import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import SearchToolbar from "../components/SearchToolbar";
import GradebookTable from "../components/GradebookTable";

function getGradeLetter(score) {
  if (score === null || score === undefined) return "-";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export default function Gradebook() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, average: "N/A" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedAssignment, setSelectedAssignment] = useState("All Assignments");

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    assignmentService.getSubmissions().then((data) => setSubmissions(data || []));
    assignmentService.getAssignments().then((data) => setAssignments(data || []));
    assignmentService.getBatches().then((data) => setBatches(data || []));
    assignmentService.getGradebookStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  const uniqueAssignments = useMemo(() => {
    const titles = new Set();
    return assignments.filter((a) => {
      if (a.title && !titles.has(a.title)) {
        titles.add(a.title);
        return true;
      }
      return false;
    });
  }, [assignments]);

  // Filter logic
  const filteredSubmissions =
    useMemo(() => {
      return submissions.filter((s) => {
        const matchesSearch =
          (s.studentName || "")
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          (s.assignmentTitle || "")
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        const selectedBatchObj = batches.find(b => b.id === selectedBatch);
        const matchesBatch =
          selectedBatch === "All Batches" ||
          s.batch === selectedBatch ||
          (selectedBatchObj && (s.batch === selectedBatchObj.name || s.batch === selectedBatchObj.title));

        const matchesAssignment =
          selectedAssignment === "All Assignments" ||
          s.assignmentTitle === selectedAssignment;

        let matchesStatus = true;

        if (
          selectedStatus !==
          "All Statuses"
        ) {
          if (
            selectedStatus === "Graded"
          ) {
            matchesStatus =
              s.status === "Graded";
          } else if (
            selectedStatus === "Pending"
          ) {
            matchesStatus = [
              "Submitted",
              "Pending",
              "Late Submitted",
            ].includes(s.status);
          } else if (
            selectedStatus === "Late"
          ) {
            matchesStatus =
              s.status ===
              "Late Submitted";
          }
        }

        return (
          matchesSearch &&
          matchesBatch &&
          matchesAssignment &&
          matchesStatus
        );
      });
    }, [
      submissions,
      searchQuery,
      selectedBatch,
      selectedAssignment,
      selectedStatus,
      batches,
    ]);

  // Unique batches present in the submissions that match the OTHER filters
  const availableBatches = useMemo(() => {
    const filteredForBatch = submissions.filter((s) => {
      const matchesSearch =
        (s.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.assignmentTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAssignment =
        selectedAssignment === "All Assignments" ||
        s.assignmentTitle === selectedAssignment;

      let matchesStatus = true;
      if (selectedStatus !== "All Statuses") {
        if (selectedStatus === "Graded") {
          matchesStatus = s.status === "Graded";
        } else if (selectedStatus === "Pending") {
          matchesStatus = ["Submitted", "Pending", "Late Submitted"].includes(s.status);
        } else if (selectedStatus === "Late") {
          matchesStatus = s.status === "Late Submitted";
        }
      }
      return matchesSearch && matchesAssignment && matchesStatus;
    });

    const activeBatchNames = new Set(filteredForBatch.map((s) => s.batch));
    return batches.filter((b) => {
      const isSelected = b.id === selectedBatch;
      const bName = b.name || b.title || b.id;
      return isSelected || activeBatchNames.has(bName) || activeBatchNames.has(b.name) || activeBatchNames.has(b.title) || activeBatchNames.has(b.id);
    });
  }, [submissions, searchQuery, selectedAssignment, selectedStatus, batches, selectedBatch]);

  // Unique assignments present in the submissions that match the OTHER filters
  const availableAssignments = useMemo(() => {
    const filteredForAssignment = submissions.filter((s) => {
      const matchesSearch =
        (s.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.assignmentTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

      const selectedBatchObj = batches.find(b => b.id === selectedBatch);
      const matchesBatch =
        selectedBatch === "All Batches" ||
        s.batch === selectedBatch ||
        (selectedBatchObj && (s.batch === selectedBatchObj.name || s.batch === selectedBatchObj.title));

      let matchesStatus = true;
      if (selectedStatus !== "All Statuses") {
        if (selectedStatus === "Graded") {
          matchesStatus = s.status === "Graded";
        } else if (selectedStatus === "Pending") {
          matchesStatus = ["Submitted", "Pending", "Late Submitted"].includes(s.status);
        } else if (selectedStatus === "Late") {
          matchesStatus = s.status === "Late Submitted";
        }
      }
      return matchesSearch && matchesBatch && matchesStatus;
    });

    const activeAssignmentTitles = new Set(filteredForAssignment.map((s) => s.assignmentTitle));
    const titles = new Set();
    return uniqueAssignments.filter((a) => {
      const isSelected = a.title === selectedAssignment;
      if (isSelected || activeAssignmentTitles.has(a.title)) {
        if (a.title && !titles.has(a.title)) {
          titles.add(a.title);
          return true;
        }
      }
      return false;
    });
  }, [submissions, searchQuery, selectedBatch, selectedStatus, uniqueAssignments, batches, selectedAssignment]);

  // Unique statuses present in the submissions that match the OTHER filters
  const availableStatuses = useMemo(() => {
    const filteredForStatus = submissions.filter((s) => {
      const matchesSearch =
        (s.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.assignmentTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

      const selectedBatchObj = batches.find(b => b.id === selectedBatch);
      const matchesBatch =
        selectedBatch === "All Batches" ||
        s.batch === selectedBatch ||
        (selectedBatchObj && (s.batch === selectedBatchObj.name || s.batch === selectedBatchObj.title));

      const matchesAssignment =
        selectedAssignment === "All Assignments" ||
        s.assignmentTitle === selectedAssignment;

      return matchesSearch && matchesBatch && matchesAssignment;
    });

    const activeStatuses = new Set();
    filteredForStatus.forEach((s) => {
      if (s.status === "Graded") {
        activeStatuses.add("Graded");
      }
      if (["Submitted", "Pending", "Late Submitted"].includes(s.status)) {
        activeStatuses.add("Pending");
      }
      if (s.status === "Late Submitted") {
        activeStatuses.add("Late");
      }
    });

    const statusesList = [
      { value: "Graded", label: "Graded" },
      { value: "Pending", label: "Pending" },
      { value: "Late", label: "Late" },
    ];

    return statusesList.filter((status) => {
      const isSelected = status.value === selectedStatus;
      return isSelected || activeStatuses.has(status.value);
    });
  }, [submissions, searchQuery, selectedBatch, selectedAssignment, batches, selectedStatus]);

  // Find nearest upcoming assignment deadline
  const nextDeadline = useMemo(() => {
    const now = new Date();
    const upcomingAssignments = assignments
      .filter((a) => {
        if (!a.dueDate) return false;
        // Keep assignment active till end of day
        const dueDate = new Date(a.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        return dueDate.getTime() >= now.getTime();
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return upcomingAssignments[0] || null;
  }, [assignments]);

  const handleExportCSV = useCallback(() => {
    const headers = [
      "Student",
      "Batch",
      "Assignment",
      "Marks",
      "Status",
      "Date",
    ];

    const rows = filteredSubmissions.map((s) => [
      s.studentName,
      s.batch,
      s.assignmentTitle,
      s.score !== null
        ? `${s.score}/100`
        : "--/100",
      s.status,
      s.submittedAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) => e.join(",")),
      ].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `LMS_Gradebook_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredSubmissions]);

  const handleExportExcel = useCallback(() => {
    const worksheetData = filteredSubmissions.map((s) => ({
      "Student": s.studentName || "",
      "Batch": s.batch || "",
      "Assignment": s.assignmentTitle || "",
      "Marks": s.score !== null ? `${s.score}/100` : "--/100",
      "Status": s.status || "",
      "Date": s.submittedAt || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gradebook");
    XLSX.writeFile(
      workbook,
      `LMS_Gradebook_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  }, [filteredSubmissions]);

  const handleConfirmDelete =
    useCallback(() => {
      if (deleteTarget) {
        setSubmissions((prev) =>
          prev.filter(
            (s) => s.id !== deleteTarget
          )
        );

        setDeleteTarget(null);
      }
    }, [deleteTarget]);

  const handleRowClick =
    useCallback(
      (s) => {
        const isSubmitted = [
          "Submitted",
          "Pending",
          "Late Submitted",
        ].includes(s.status);

        if (
          isSubmitted ||
          s.status === "Graded"
        ) {
          navigate(
            `/trainer/assignments/review/${s.id}`
          );
        }
      },
      [navigate]
    );

  const handleEdit = useCallback(
    (s) => {
      const isSubmitted = [
        "Submitted",
        "Pending",
        "Late Submitted",
      ].includes(s.status);

      if (
        isSubmitted ||
        s.status === "Graded"
      ) {
        navigate(
          `/trainer/assignments/review/${s.id}`
        );
      }
    },
    [navigate]
  );

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full space-y-6 animate-fadeIn pb-12">
        {/* Page Header */}
        <PageHeader
          title="Gradebook"
          subtitle="Review submission details, grade assignments, and track class performance."
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Submissions"
            value={stats.total}
            subtitle="+12% this week"
            className="bg-white"
          />

          <StatsCard
            label="Needs Grading"
            value={
              <span className="text-rose-600">
                {stats.pending}
              </span>
            }
            subtitle="Across current batches"
            className="bg-white"
          />

          <StatsCard
            label="Average Score"
            value={stats.average}
            subtitle={
              <span className="text-[#01AC9F] font-semibold">
                B Grade Average
              </span>
            }
            className="bg-white"
          />

          <StatsCard
            label="Next Deadline"
            value={
              nextDeadline?.title ||
              nextDeadline?.assignmentTitle ||
              "No Upcoming Assignments"
            }
            subtitle={
              (() => {
                if (!nextDeadline?.dueDate) return "-";
                const d = new Date(nextDeadline.dueDate);
                if (isNaN(d.getTime())) return nextDeadline.dueDate;
                d.setHours(23, 59, 59, 999);
                return d.toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                });
              })()
            }
            variant="accent"
            className="bg-[#6C1D5F]"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          <SearchToolbar
            searchQuery={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search students or assignments..."
          >
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-650 h-8 font-semibold w-40">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Batches">All Batches</SelectItem>
                {availableBatches.map(b => {
                  const bName = b.name || b.title || b.id;
                  return <SelectItem key={b.id} value={b.id}>{bName}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-650 h-8 font-semibold w-48">
                <SelectValue placeholder="All Assignments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Assignments">All Assignments</SelectItem>
                {availableAssignments.map(a => (
                  <SelectItem key={a.id} value={a.title}>{a.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-650 h-8 font-semibold w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                {availableStatuses.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm h-8 cursor-pointer"
                >
                  <Download size={13} /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-md rounded-lg p-1 min-w-[140px] z-50">
                <DropdownMenuItem
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md cursor-pointer text-xs font-medium"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md cursor-pointer text-xs font-medium"
                >
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SearchToolbar>

          <GradebookTable
            submissions={
              filteredSubmissions
            }
            onRowClick={
              handleRowClick
            }
            onEdit={handleEdit}
            onDelete={(id) =>
              setDeleteTarget(id)
            }
          />
        </div>
      </div>

      <DeleteDialog
        show={!!deleteTarget}
        title="Delete Gradebook Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={
          handleConfirmDelete
        }
      />
    </AppLayout>
  );
}
