import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import { ChevronLeft } from "lucide-react";

import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";
import AssignmentBasicInfoForm from "../components/AssignmentBasicInfoForm";
import ResourceAttachments from "../components/ResourceAttachments";
import SchedulingCard from "../components/SchedulingCard";
import ScopeSelector from "../components/ScopeSelector";
import SubmissionConfigCard from "../components/SubmissionConfigCard";

export default function CreateAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "pdf",
    maxMarks: 100,
    description: "",
    instructions: "",
    dueDate: "",
    dueTime: "23:59",
    allowLate: true,
    scope: "Entire Course",
    allowedFormats: ["File Upload (PDF, DOCX)"],
    maxUploadSize: "50",
    attachments: []
  });

  useEffect(() => {
    if (isEdit) {
      assignmentService.getAssignmentById(id).then(data => {
        if (data) {
          let dateStr = "";
          if (data.dueDate) dateStr = "2026-10-24";
          setFormData({
            title: data.title || "",
            type: data.type || "pdf",
            maxMarks: data.maxMarks || 100,
            description: data.description || "",
            instructions: data.instructions || "",
            dueDate: dateStr,
            dueTime: "23:59",
            allowLate: true,
            scope: data.scope || "Entire Course",
            allowedFormats: ["File Upload (PDF, DOCX)"],
            maxUploadSize: "50",
            attachments: data.attachments || []
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormatCheckbox = (format) => {
    setFormData(prev => {
      const current = prev.allowedFormats;
      return {
        ...prev,
        allowedFormats: current.includes(format)
          ? current.filter(x => x !== format)
          : [...current, format]
      };
    });
  };

  const handleSave = async (status = "Active") => {
    if (!formData.title) {
      setToast("Assignment Title is required.");
      return;
    }

    const payload = {
      title: formData.title,
      course: "Cloud Native Engineering",
      courseId: "c1",
      batch: formData.scope === "Entire Course" ? "B-2024-Q1" : "12 Students",
      scope: formData.scope,
      dueDate: formData.dueDate
        ? new Date(formData.dueDate + "T" + formData.dueTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Nov 15, 2024",
      status,
      maxMarks: Number(formData.maxMarks),
      description: formData.description,
      instructions: formData.instructions,
      attachments: formData.attachments
    };

    if (isEdit) {
      await assignmentService.updateAssignment(id, payload);
      setToast("Assignment updated successfully!");
    } else {
      await assignmentService.createAssignment(payload);
      setToast("Assignment created successfully!");
    }

    setTimeout(() => navigate("/trainer/assignments"), 1000);
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      const files = [...e.target.files];
      const newAttachments = files.map(file => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + " MB",
        type: file.name.split(".").pop()
      }));
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments]
      }));
    }
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full space-y-6 animate-fadeIn pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/trainer/assignments")}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div>
              <h1 className="text-[21px] font-bold text-slate-900 tracking-tight leading-snug">
                {isEdit ? "Edit Assignment" : "Create Assignment"}
              </h1>
              <p className="text-[13px] text-slate-400 mt-0.5">
                Configure coursework and grading rubrics for this cohort.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => navigate("/trainer/assignments")}
              className="px-4 py-1.5 rounded-md text-[13px] font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave("Draft")}
              className="px-4 py-1.5 rounded-md text-[13px] font-medium text-[#6C1D5F] bg-white border border-[#6C1D5F] hover:bg-[#6C1D5F]/5 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("Active")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium text-white bg-[#6C1D5F] hover:bg-[#4A1E47] transition-colors shadow-sm"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <AssignmentBasicInfoForm formData={formData} onChange={handleInputChange} />
            <ResourceAttachments
              attachments={formData.attachments}
              onFileUpload={handleFileUpload}
              onRemoveAttachment={handleRemoveAttachment}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <SchedulingCard formData={formData} onChange={handleInputChange} />
            <ScopeSelector scope={formData.scope} onChange={handleInputChange} />
            <SubmissionConfigCard
              formData={formData}
              onChange={handleInputChange}
              onFormatToggle={handleFormatCheckbox}
            />
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}
