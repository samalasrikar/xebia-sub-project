import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Search, X, Info, CheckSquare } from "lucide-react";
import AppLayout from "@/app/layouts/AppLayout";
import batchService from "../services/batchService";
import assignmentService from "@/features/assignments/services/assignmentService";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function CreateBatch() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEdit = !!editId;

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  // Form state
  const [batchName, setBatchName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timezone, setTimezone] = useState("(GMT+05:30) Mumbai, Kolkata");
  const [capacity, setCapacity] = useState("");
  const [minEnrollment, setMinEnrollment] = useState("");
  const [instructor, setInstructor] = useState("");

  // Students
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [validationError, setValidationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    assignmentService.getCourses()
      .then(data => setCourses(data || []))
      .catch(() => setCourses([]));

    assignmentService.getStudents()
      .then(data => setStudents(data || []))
      .catch(() => setStudents([]));

    if (isEdit) {
      batchService.getBatchById(editId).then(batch => {
        if (batch) {
          setBatchName(batch.name || "");
          setSelectedCourse(batch.course || "");
          setStartDate(batch.startDate || "");
          setEndDate(batch.endDate || "");
          setTimezone(batch.timezone || "(GMT+05:30) Mumbai, Kolkata");
          setCapacity(batch.capacity?.toString() || "");
          setMinEnrollment(batch.minEnrollment?.toString() || "");
          setInstructor(batch.instructor || "");
          setSelectedStudentIds(batch.studentIds || []);
        }
      }).catch(() => {});
    }
  }, [isEdit, editId]);

  const availableStudents = useMemo(() => {
    return students.filter(s =>
      !selectedStudentIds.includes(s.id) &&
      (s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.id?.toLowerCase().includes(studentSearch.toLowerCase()))
    );
  }, [students, selectedStudentIds, studentSearch]);

  const selectedStudents = useMemo(() =>
    students.filter(s => selectedStudentIds.includes(s.id)),
    [students, selectedStudentIds]
  );

  const toggleSelect = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const removeStudent = (id) => {
    setSelectedStudentIds(prev => prev.filter(s => s !== id));
  };

  const handleSubmit = async (status = "Active") => {
    setValidationError("");
    if (!batchName.trim()) { setValidationError("Batch Name is required."); return; }
    if (!selectedCourse) { setValidationError("Please select a course."); return; }
    if (!startDate || !endDate) { setValidationError("Start and End dates are required."); return; }

    setIsSaving(true);
    const payload = {
      name: batchName.trim(),
      course: selectedCourse,
      startDate,
      endDate,
      timezone,
      capacity: parseInt(capacity) || 50,
      minEnrollment: parseInt(minEnrollment) || 10,
      instructor,
      enrolled: selectedStudentIds.length,
      studentIds: selectedStudentIds,
      status,
    };

    try {
      if (isEdit) {
        await batchService.updateBatch(editId, payload);
      } else {
        await batchService.createBatch(payload);
      }
      navigate("/trainer/batches");
    } catch {
      setValidationError("Failed to save batch. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl" style={{ fontFamily: "'Geist', sans-serif" }}>

        {/* Breadcrumb + Header */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <Button variant="link" onClick={() => navigate("/trainer/batches")} className="hover:text-[#6C1D5F] transition-colors cursor-pointer text-slate-400 p-0 h-auto">Batches</Button>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-semibold">{isEdit ? "Edit Batch" : "Create New Batch"}</span>
          </nav>
          <h1 className="text-3xl font-black text-[#6C1D5F] tracking-tight leading-none">
            {isEdit ? "Edit Batch" : "Create New Batch"}
          </h1>
          <p className="text-slate-400 text-xs mt-2">Configure academic parameters and enroll students for the upcoming term.</p>
        </div>

        {validationError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <Info size={13} />
            {validationError}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-12 gap-6 items-start">

          {/* ── Left: Form Sections ── */}
          <div className="col-span-12 lg:col-span-8 space-y-5">
            {/* Section 1: Basic Information */}
            <Card className="bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 bg-[#6C1D5F]/10 text-[#6C1D5F] rounded-full flex items-center justify-center font-black text-sm">1</span>
                <h3 className="text-sm font-black text-[#6C1D5F]">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Batch Name *</label>
                  <Input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:border-[#6C1D5F] focus:bg-white transition-all h-10 font-semibold"
                    placeholder="e.g., B-2024-Q3 Advanced Cloud Architect"
                    value={batchName}
                    onChange={e => setBatchName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Course Selection *</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 h-10 font-semibold">
                      <SelectValue placeholder="Select a Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(c => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}
                      <SelectItem value="Cloud Native Engineering">Cloud Native Engineering</SelectItem>
                      <SelectItem value="Data Engineering Masters">Data Engineering Masters</SelectItem>
                      <SelectItem value="Full-stack JavaScript">Full-stack JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Time Zone</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 h-10 font-semibold">
                      <SelectValue placeholder="Select Time Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="(GMT+05:30) Mumbai, Kolkata">(GMT+05:30) Mumbai, Kolkata</SelectItem>
                      <SelectItem value="(GMT+00:00) London, Lisbon">(GMT+00:00) London, Lisbon</SelectItem>
                      <SelectItem value="(GMT-05:00) New York, Toronto">(GMT-05:00) New York, Toronto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Start Date *</label>
                  <Input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:border-[#6C1D5F] focus:bg-white outline-none transition-all cursor-pointer h-10"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">End Date *</label>
                  <Input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:border-[#6C1D5F] focus:bg-white outline-none transition-all cursor-pointer h-10"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Section 2: Capacity & Settings */}
            <Card className="bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 bg-[#6C1D5F]/10 text-[#6C1D5F] rounded-full flex items-center justify-center font-black text-sm">2</span>
                <h3 className="text-sm font-black text-[#6C1D5F]">Capacity & Settings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Student Limit</label>
                  <Input
                    type="number"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:border-[#6C1D5F] focus:bg-white outline-none transition-all h-10"
                    placeholder="50"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Min Enrollment</label>
                  <Input
                    type="number"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:border-[#6C1D5F] focus:bg-white outline-none transition-all h-10"
                    placeholder="10"
                    value={minEnrollment}
                    onChange={e => setMinEnrollment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Instructor</label>
                  <Select value={instructor} onValueChange={setInstructor}>
                    <SelectTrigger className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 h-10 font-semibold">
                      <SelectValue placeholder="Select Instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Elena Richards">Dr. Elena Richards</SelectItem>
                      <SelectItem value="Prof. Marcus Thorne">Prof. Marcus Thorne</SelectItem>
                      <SelectItem value="Sarah Jenkins">Sarah Jenkins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Section 3: Enrollment */}
            <Card className="bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#6C1D5F]/10 text-[#6C1D5F] rounded-full flex items-center justify-center font-black text-sm">3</span>
                  <h3 className="text-sm font-black text-[#6C1D5F]">Enrollment</h3>
                </div>
                {selectedStudentIds.length > 0 && (
                  <span className="text-xs font-bold text-[#6C1D5F]">{selectedStudentIds.length} Students Selected</span>
                )}
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                  <Input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-700 focus:border-[#6C1D5F] focus:bg-white outline-none transition-all h-8"
                    placeholder="Search by name, email, or student ID..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-56">
                  {/* Available Students */}
                  <div className="border border-slate-100 rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-slate-50 px-4 py-2 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 flex-shrink-0">
                      Available Students
                    </div>
                    <div className="flex-1 overflow-y-auto p-1">
                      {availableStudents.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-[11px] text-slate-400">No students available</div>
                      ) : availableStudents.map(s => (
                        <div
                          key={s.id}
                          onClick={() => toggleSelect(s.id)}
                          className="flex items-center gap-3 p-2.5 hover:bg-slate-50 transition-colors cursor-pointer rounded-md"
                        >
                          <Checkbox checked={selectedStudentIds.includes(s.id)} onCheckedChange={() => toggleSelect(s.id)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{s.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">ID: {s.id}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Students */}
                  <div className="border border-slate-100 rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-slate-50 px-4 py-2 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                      <span>Selected Students</span>
                      {selectedStudentIds.length > 0 && (
                        <Button
                          variant="link"
                          onClick={() => setSelectedStudentIds([])}
                          className="text-[#6C1D5F] hover:underline font-bold text-[9px] cursor-pointer p-0 h-auto"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-1 space-y-1">
                      {selectedStudents.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-[11px] text-slate-400">No students selected</div>
                      ) : selectedStudents.map(s => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-2 bg-[#6C1D5F]/5 rounded-md border border-[#6C1D5F]/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#6C1D5F]/10 text-[#6C1D5F] flex items-center justify-center text-[9px] font-black flex-shrink-0">
                              {initials(s.name)}
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 truncate">{s.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeStudent(s.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                          >
                            <X size={13} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Right: Summary Sidebar (sticky) ── */}
          <div className="col-span-12 lg:col-span-4 sticky top-6 space-y-4">

            {/* Summary Card */}
            <Card className="bg-white border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-[#6C1D5F] px-5 py-4">
                <h3 className="text-white font-black text-sm">Batch Summary</h3>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Batch Name</span>
                    <span className="font-bold text-slate-700 text-right max-w-[55%] truncate">{batchName || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Course</span>
                    <span className="font-bold text-slate-700 text-right max-w-[55%] truncate">{selectedCourse || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Enrollment</span>
                    <span className="font-bold text-slate-700">{selectedStudentIds.length} / {capacity || "?"} Students</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Duration</span>
                    <span className="font-bold text-slate-700">
                      {startDate && endDate ? `${startDate} – ${endDate}` : "—"}
                    </span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex gap-2.5">
                  <Info size={14} className="text-[#6C1D5F] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Once created, an enrollment email will be automatically sent to all selected students with login credentials.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Button
                    onClick={() => handleSubmit("Active")}
                    disabled={isSaving}
                    className="w-full bg-[#6C1D5F] hover:bg-[#4A1E47] text-white py-2.5 rounded-lg font-black text-xs shadow-sm cursor-pointer disabled:opacity-60 h-10"
                  >
                    {isSaving ? "Saving..." : isEdit ? "Update Batch" : "Create Batch"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit("Upcoming")}
                    disabled={isSaving}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 py-2.5 rounded-lg font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-60 h-10"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/trainer/batches")}
                    className="w-full text-red-500 font-semibold py-2 text-xs hover:underline cursor-pointer h-8"
                  >
                    Discard Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gradient accent card */}
            <div className="relative overflow-hidden rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg, #6C1D5F 0%, #3a0035 100%)" }}>
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1.5">Pro Tip</p>
                <h4 className="text-sm font-black leading-tight">Automate with Curriculum Templates</h4>
                <p className="text-[11px] mt-2 opacity-80 leading-relaxed">Load pre-defined weekly schedules and assignment release dates instantly.</p>
              </div>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-6 -top-6 w-16 h-16 bg-white/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
