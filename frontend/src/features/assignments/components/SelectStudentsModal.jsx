import React, { useState, useEffect } from "react";
import { X, Search, ChevronDown, Send, Plus, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import assignmentService from "../services/assignmentService";

export default function SelectStudentsModal({ isOpen, onClose, selectedStudents, onApply }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState("All Batches");
  const [localSelection, setLocalSelection] = useState([]);

  // Backend states
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Enroll Student form states
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentBatch, setNewStudentBatch] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const fetchStudentsAndBatches = async () => {
    setLoading(true);
    try {
      const [sData, bData] = await Promise.all([
        assignmentService.getStudents(),
        assignmentService.getBatches()
      ]);
      setStudents(sData || []);
      setBatches(bData || []);
      
      // Select the first batch as default in the creation form if present
      if (bData && bData.length > 0) {
        setNewStudentBatch(bData[0].id);
      }
    } catch (e) {
      console.error("Failed to load students/batches", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStudentsAndBatches();
      setLocalSelection(selectedStudents || []);
      setNewStudentId("");
      setNewStudentName("");
      setEnrollError("");
      setEnrollSuccess(false);
    }
  }, [isOpen, selectedStudents]);

  const handleToggle = (studentName) => {
    setLocalSelection(prev =>
      prev.includes(studentName) ? prev.filter(name => name !== studentName) : [...prev, studentName]
    );
  };

  const handleRemoveChip = (studentName) => {
    setLocalSelection(prev => prev.filter(name => name !== studentName));
  };

  const handleClearAll = () => {
    setLocalSelection([]);
  };

  const handleApply = () => {
    onApply(localSelection);
    onClose();
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    setEnrollError("");
    setEnrollSuccess(false);

    if (!newStudentId.trim() || !newStudentName.trim() || !newStudentBatch) {
      setEnrollError("Please fill out all fields to enroll the student.");
      return;
    }

    const trimmedId = newStudentId.trim();
    if (students.some(s => s.id.toLowerCase() === trimmedId.toLowerCase())) {
      setEnrollError("A student with this ID is already enrolled.");
      return;
    }

    try {
      await assignmentService.createStudent({
        id: trimmedId,
        name: newStudentName.trim(),
        batch: newStudentBatch,
        status: "Active"
      });
      setEnrollSuccess(true);
      setNewStudentId("");
      setNewStudentName("");
      // Refetch
      fetchStudentsAndBatches();
    } catch (err) {
      setEnrollError("Failed to enroll student. Please try again.");
    }
  };

  const filteredStudents = students.filter(student => {
    const nameMatch = student.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = student.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || idMatch;
    
    const matchesBatch = selectedBatchFilter === "All Batches" || student.batch === selectedBatchFilter;
    return matchesSearch && matchesBatch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] md:w-[768px] max-w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Configure Students</h1>
            <p className="text-xs text-slate-400">Manage cohort enrollments and assign individual coursework</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Enroll Student Form (Trainer Function) */}
        <div className="px-6 py-5 border-b border-slate-100 bg-[#6C1D5F]/5">
          <form onSubmit={handleEnrollStudent} className="space-y-3">
            <h2 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} /> Enroll New Student
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Student ID</label>
                <input
                  type="text"
                  placeholder="e.g. STU-9901"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F]"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                />
              </div>
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Robert Smith"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F]"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                />
              </div>
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Cohort / Batch</label>
                <Select value={newStudentBatch} onValueChange={setNewStudentBatch}>
                  <SelectTrigger className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] cursor-pointer h-8 font-semibold">
                    <SelectValue placeholder="Cohort / Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.id} - {b.title}</SelectItem>
                    ))}
                    {batches.length === 0 && <SelectItem value="none" disabled>No Batches Created</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={batches.length === 0}
                  className="w-full px-3 py-1.5 bg-[#6C1D5F] text-white hover:bg-[#4A1E47] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus size={13} /> Enroll
                </button>
              </div>
            </div>
            {enrollError && <p className="text-[10px] font-bold text-red-500 mt-1">{enrollError}</p>}
            {enrollSuccess && <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1"><Check size={12} /> Student enrolled successfully!</p>}
          </form>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-4 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100">
          <div className="md:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-4 focus:ring-[#6C1D5F]/5 focus:border-[#6C1D5F] outline-none transition-all text-slate-700"
              placeholder="Search by name or ID..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={selectedBatchFilter} onValueChange={setSelectedBatchFilter}>
              <SelectTrigger className="w-full bg-white border border-slate-200 rounded-lg text-xs focus:ring-4 focus:ring-[#6C1D5F]/5 focus:border-[#6C1D5F] outline-none transition-all text-slate-700 cursor-pointer h-9 font-semibold">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Batches">All Batches</SelectItem>
                {batches.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 max-h-[300px]">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading students...</div>
          ) : filteredStudents.map((student) => {
            const isSelected = localSelection.includes(student.name);
            return (
              <label
                key={student.id}
                className={`flex items-center px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group ${
                  isSelected ? "bg-slate-50/50" : ""
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    checked={isSelected}
                    onChange={() => handleToggle(student.name)}
                    className="w-4 h-4 rounded border-slate-300 text-[#6C1D5F] focus:ring-[#6C1D5F]/20 cursor-pointer accent-[#6C1D5F]"
                    type="checkbox"
                  />
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#6C1D5F]/10 text-[#6C1D5F] flex items-center justify-center font-bold text-xs">
                    {student.name ? student.name.split(" ").map(n => n[0]).join("").toUpperCase() : "ST"}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-xs font-bold text-slate-800">{student.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ID: {student.id} • {student.batch}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 px-2 py-0.5 bg-[#ffd7f0] text-[#762668] text-[9px] font-black rounded uppercase tracking-wider transition-opacity">
                  {student.status}
                </div>
              </label>
            );
          })}
          {!loading && filteredStudents.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No students found matching your filters. Enroll one above!
            </div>
          )}
        </div>

        {/* Bottom Selected Area & Actions */}
        <div className="bg-slate-50/50 p-5 space-y-4 border-t border-slate-100">
          {/* Chip Area */}
          <div className="flex flex-wrap items-center gap-1.5 min-h-[30px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1.5">
              Selected ({localSelection.length}):
            </span>
            {localSelection.map((name) => (
              <div
                key={name}
                className="flex items-center gap-1 px-2.5 py-0.5 bg-[#6C1D5F] text-white rounded-full text-[10px] font-semibold"
              >
                {name}
                <button
                  type="button"
                  onClick={() => handleRemoveChip(name)}
                  className="hover:text-pink-200 transition-colors cursor-pointer"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {localSelection.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[10px] text-[#6C1D5F] font-bold hover:underline ml-auto cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100/60">
            <button
              onClick={onClose}
              type="button"
              className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              type="button"
              className="w-full sm:w-auto px-7 py-2 text-xs font-bold text-white bg-[#6C1D5F] hover:bg-[#4A1E47] rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Assign to Students</span>
              <Send size={12} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
