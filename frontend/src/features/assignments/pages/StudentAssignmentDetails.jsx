import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assignmentService from "../services/assignmentService";
import { AlertTriangle } from "lucide-react";

import Toast from "../components/Toast";
import Breadcrumbs from "../components/Breadcrumbs";
import FileCard from "../components/FileCard";
import AssignmentOverview from "../components/AssignmentOverview";
import AssignmentMetadataCard from "../components/AssignmentMetadataCard";
import SubmissionUploadForm from "../components/SubmissionUploadForm";

export default function StudentAssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  
  const [toast, setToast] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    assignmentService.getAssignmentById(id).then(data => {
      setAssignment(data);
    });
  }, [id]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const addFiles = useCallback((files) => {
    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.name.split(".").pop()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = [...e.dataTransfer.files];
      addFiles(files);
    }
  }, [addFiles]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const files = [...e.target.files];
      addFiles(files);
    }
  }, [addFiles]);

  const handleRemoveFile = useCallback((index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!assignment) return;
    if (uploadedFiles.length === 0) {
      setToast("Please upload at least one file before submitting.");
      return;
    }

    const payload = {
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      attempt: 1,
      files: uploadedFiles,
      studentNote: notes
    };

    await assignmentService.submitAssignment("s4", payload);
    setToast("Assignment submitted successfully!");
    
    setTimeout(() => {
      navigate(`/student/assignments/${assignment.id}/submissions`);
    }, 1000);
  }, [assignment, uploadedFiles, notes, navigate]);

  const handleCancel = useCallback(() => {
    navigate("/student/assignments");
  }, [navigate]);

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading assignment details...
      </div>
    );
  }

  const isOverdue = assignment.status === "Overdue" || assignment.id === "a5";

  const breadcrumbItems = [
    { label: "Dashboard", to: "/student" },
    { label: "Assignments", to: "/student/assignments" },
    { label: assignment.title },
  ];

  return (
    <div className="max-w-[1050px] w-full mx-auto px-6 md:px-8 py-8 space-y-6 animate-fadeIn pb-12">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{assignment.title}</h1>
            <p className="text-[13px] text-slate-400 mt-1">{assignment.course}</p>
          </div>
          
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold border shrink-0 ${
            isOverdue
              ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
              : "bg-amber-50 text-amber-700 border-amber-100"
          }`}>
            <AlertTriangle size={14} />
            <span>
              {isOverdue 
                ? `Overdue: Due ${assignment.dueDate}`
                : `Due date: ${assignment.dueDate}`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Instructions and Material */}
        <div className="lg:col-span-8 space-y-6">
          <AssignmentOverview assignment={assignment} isOverdue={isOverdue} />

          {/* Reference Materials Card */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h2 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#6C1D5F] hidden" /> Overview
              </h2>
              <div className="flex flex-col gap-3">
                {assignment.attachments.map((file, idx) => (
                  <FileCard
                    key={idx}
                    name={file.name}
                    size={file.size}
                    type={file.type}
                    onClick={() => {
                      alert(file.type === "link" ? `Navigating to documentation link...` : `Downloading ${file.name}...`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Submission Area */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AssignmentMetadataCard assignment={assignment} />
          
          <SubmissionUploadForm
            dragActive={dragActive}
            uploadedFiles={uploadedFiles}
            notes={notes}
            onNotesChange={setNotes}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
