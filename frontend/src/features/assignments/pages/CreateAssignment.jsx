import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";
import AssignmentBasicInfoForm from "../components/AssignmentBasicInfoForm";
import ResourceAttachments from "../components/ResourceAttachments";
import SchedulingCard from "../components/SchedulingCard";
import ScopeSelector from "../components/ScopeSelector";
import SubmissionConfigCard from "../components/SubmissionConfigCard";
import SelectBatchesModal from "../components/SelectBatchesModal";
import SelectStudentsModal from "../components/SelectStudentsModal";
import SelectCourseModal from "../components/SelectCourseModal";

export default function CreateAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [toast, setToast] = useState(null);
  const [isBatchesModalOpen, setIsBatchesModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

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
    attachments: [],
    selectedBatches: [],
    selectedStudents: [],
    autoAssign: false
  });

  useEffect(() => {
    if (isEdit) {
      assignmentService.getAssignmentById(id).then(data => {
        if (data) {
          let dateStr = "";
          if (data.dueDate) {
            try {
              const d = new Date(data.dueDate);
              if (!isNaN(d.getTime())) {
                dateStr = d.toISOString().split("T")[0];
              }
            } catch (e) {
              dateStr = "2026-10-24";
            }
          }
          
          const scope = data.scope || "Entire Course";
          const batchVal = data.batch || "";
          
          let selectedBatches = [];
          let selectedStudents = [];
          
          if (scope === "Specific Batches") {
            selectedBatches = batchVal ? batchVal.split(", ") : [];
          } else if (scope === "Individual Students") {
            selectedStudents = batchVal ? batchVal.split(", ") : [];
          }

          setFormData({
            title: data.title || "",
            type: data.type || "pdf",
            maxMarks: data.maxMarks || 100,
            description: data.description || "",
            instructions: data.instructions || "",
            dueDate: dateStr,
            dueTime: "23:59",
            allowLate: true,
            scope,
            allowedFormats: ["File Upload (PDF, DOCX)"],
            maxUploadSize: "50",
            attachments: data.attachments || [],
            selectedBatches,
            selectedStudents,
            autoAssign: false // load default or setting
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

    let batch = "B-2024-Q1"; // default
    if (formData.scope === "Specific Batches") {
      batch = formData.selectedBatches.length > 0 ? formData.selectedBatches.join(", ") : "No Batches Selected";
    } else if (formData.scope === "Individual Students") {
      batch = formData.selectedStudents.length > 0 ? formData.selectedStudents.join(", ") : "No Students Selected";
    }

    const payload = {
      title: formData.title,
      course: "Cloud Native Engineering",
      courseId: "c1",
      batch,
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
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => navigate("/trainer/assignments")}
              className="p-1.5 rounded-lg border border-slate-205 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer h-8 w-8"
            >
              <ChevronLeft size={16} />
            </Button>
            <div>
              <h1 className="text-[21px] font-bold text-slate-900 tracking-tight leading-snug">
                {isEdit ? "Edit Assignment" : "Create Assignment"}
              </h1>
              <p className="text-[13px] text-slate-404 text-slate-400 mt-0.5">
                Configure coursework and grading rubrics for this cohort.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <Button
              onClick={() => navigate("/trainer/assignments")}
              variant="outline"
              className="px-4 py-1.5 rounded-md text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave("Draft")}
              variant="outline"
              className="px-4 py-1.5 rounded-md text-[13px] font-semibold text-[#6C1D5F] bg-white border border-[#6C1D5F] hover:bg-[#6C1D5F]/5 transition-colors cursor-pointer h-9"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave("Active")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-bold text-white bg-[#6C1D5F] hover:bg-[#4A1E47] transition-colors shadow-sm cursor-pointer h-9"
            >
              Publish
            </Button>
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
            <ScopeSelector
              scope={formData.scope}
              onChange={handleInputChange}
              selectedBatches={formData.selectedBatches}
              selectedStudents={formData.selectedStudents}
              autoAssign={formData.autoAssign}
              onOpenBatchesModal={() => setIsBatchesModalOpen(true)}
              onOpenStudentsModal={() => setIsStudentsModalOpen(true)}
              onOpenCourseModal={() => setIsCourseModalOpen(true)}
            />
            <SubmissionConfigCard
              formData={formData}
              onChange={handleInputChange}
              onFormatToggle={handleFormatCheckbox}
            />
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {isBatchesModalOpen && (
        <SelectBatchesModal
          isOpen={isBatchesModalOpen}
          onClose={() => setIsBatchesModalOpen(false)}
          selectedBatches={formData.selectedBatches}
          onApply={(batches) => handleInputChange("selectedBatches", batches)}
        />
      )}
      {isStudentsModalOpen && (
        <SelectStudentsModal
          isOpen={isStudentsModalOpen}
          onClose={() => setIsStudentsModalOpen(false)}
          selectedStudents={formData.selectedStudents}
          onApply={(students) => handleInputChange("selectedStudents", students)}
        />
      )}
      {isCourseModalOpen && (
        <SelectCourseModal
          isOpen={isCourseModalOpen}
          onClose={() => setIsCourseModalOpen(false)}
          autoAssign={formData.autoAssign}
          onApply={(val) => handleInputChange("autoAssign", val)}
        />
      )}
    </AppLayout>
  );
}
