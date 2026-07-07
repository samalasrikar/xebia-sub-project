import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { Download } from "lucide-react";

import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import SearchToolbar from "../components/SearchToolbar";
import GradebookTable from "../components/GradebookTable";

export default function Gradebook() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    assignmentService.getSubmissions().then((data) =>
      setSubmissions(data || [])
    );

    assignmentService.getAssignments().then((data) =>
      setAssignments(data || [])
    );

    assignmentService.getBatches().then((data) =>
      setBatches(data || [])
    );
  }, []);

  // Compute Stats
  const stats = useMemo(() => {
    const total = submissions.length;

    const pending = submissions.filter((s) =>
      ["Submitted", "Pending", "Late Submitted"].includes(s.status)
    ).length;

    const graded = submissions.filter(
      (s) =>
        s.status === "Graded" &&
        s.score !== null
    );

    const average =
      graded.length > 0
        ? Math.round(
            graded.reduce(
              (sum, s) => sum + s.score,
              0
            ) / graded.length
          ) + "%"
        : "N/A";

    return {
      total,
      pending,
      average,
    };
  }, [submissions]);

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
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
    );

  return upcomingAssignments[0] || null;

}, [assignments]);

  const handleExport = useCallback(() => {
    const headers = [
      "Student",
      "Batch",
      "Assignment",
      "Marks",
      "Status",
      "Date",
    ];

    const rows = submissions.map((s) => [
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

    const link =
      document.createElement("a");

    link.setAttribute(
      "href",
      encodeURI(csvContent)
    );

    link.setAttribute(
      "download",
      `LMS_Gradebook_${
        new Date()
          .toISOString()
          .split("T")[0]
      }.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }, [submissions]);

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

  // Filter logic
  const filteredSubmissions =
    useMemo(() => {
      return submissions.filter((s) => {
        const matchesSearch =
          s.studentName
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          s.assignmentTitle
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        const matchesBatch =
          selectedBatch ===
            "All Batches" ||
          s.batch === selectedBatch;

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
          matchesStatus
        );
      });
    }, [
      submissions,
      searchQuery,
      selectedBatch,
      selectedStatus,
    ]);

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
        >
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
        </PageHeader>

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
              nextDeadline?.dueDate
                ? new Date(
                    new Date(nextDeadline.dueDate).setHours(23, 59)
                    ).toLocaleString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )
                : "-"
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
            <select
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-650 focus:border-[#6C1D5F] outline-none"
              value={selectedBatch}
              onChange={(e) =>
                setSelectedBatch(
                  e.target.value
                )
              }
            >
              <option>
                All Batches
              </option>

              {batches.map((b) => (
                <option
                  key={b.id}
                  value={b.title}
                >
                  {b.title}
                </option>
              ))}
            </select>

            <select
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-650 focus:border-[#6C1D5F] outline-none"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
            >
              <option>
                All Statuses
              </option>

              <option>
                Graded
              </option>

              <option>
                Pending
              </option>

              <option>
                Late
              </option>
            </select>
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
