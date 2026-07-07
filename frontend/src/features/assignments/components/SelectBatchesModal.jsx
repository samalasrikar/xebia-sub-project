import React, { useState, useEffect } from "react";
import { X, Search, Users, Plus, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import assignmentService from "../services/assignmentService";

export default function SelectBatchesModal({ isOpen, onClose, selectedBatches, onApply }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelection, setLocalSelection] = useState([]);
  
  // Dynamic backend states
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // New batch creation form states
  const [newBatchId, setNewBatchId] = useState("");
  const [newBatchTitle, setNewBatchTitle] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const fetchBatchesAndStudents = async () => {
    setLoading(true);
    try {
      const [bData, sData] = await Promise.all([
        assignmentService.getBatches(),
        assignmentService.getStudents()
      ]);
      setBatches(bData || []);
      setStudents(sData || []);
    } catch (e) {
      console.error("Failed to fetch batches/students", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBatchesAndStudents();
      setLocalSelection(selectedBatches || []);
      setNewBatchId("");
      setNewBatchTitle("");
      setCreateError("");
      setCreateSuccess(false);
    }
  }, [isOpen, selectedBatches]);

  const handleToggle = (batchId) => {
    setLocalSelection(prev =>
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  const handleApply = () => {
    onApply(localSelection);
    onClose();
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess(false);

    if (!newBatchId.trim() || !newBatchTitle.trim()) {
      setCreateError("Both Cohort Code and Cohort Title are required.");
      return;
    }

    const trimmedId = newBatchId.trim();
    if (batches.some(b => b.id?.toLowerCase() === trimmedId.toLowerCase())) {
      setCreateError("A cohort with this code already exists.");
      return;
    }

    try {
      await assignmentService.createBatch({
        id: trimmedId,
        title: newBatchTitle.trim()
      });
      setCreateSuccess(true);
      setNewBatchId("");
      setNewBatchTitle("");
      // Refetch
      fetchBatchesAndStudents();
    } catch (err) {
      setCreateError("Failed to create cohort. Please try again.");
    }
  };

  const filteredBatches = batches.filter(
    b =>
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] md:w-[768px] max-w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Configure Batches</h1>
            <p className="text-xs text-slate-400 mt-1">Select targeted cohorts or create a new one</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Create Cohort Form (Trainer function) */}
        <div className="px-8 py-5 border-b border-slate-100 bg-[#6C1D5F]/5">
          <form onSubmit={handleCreateBatch} className="space-y-3">
            <h2 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} /> Create New Cohort / Batch
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Cohort Code</label>
                <input
                  type="text"
                  placeholder="e.g. B-2024-Q4"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F]"
                  value={newBatchId}
                  onChange={(e) => setNewBatchId(e.target.value)}
                />
              </div>
              <div className="sm:col-span-6 space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Cohort Title</label>
                <input
                  type="text"
                  placeholder="e.g. DevOps & SRE Practices"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F]"
                  value={newBatchTitle}
                  onChange={(e) => setNewBatchTitle(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full px-3 py-1.5 bg-[#6C1D5F] text-white hover:bg-[#4A1E47] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>
            {createError && <p className="text-[10px] font-bold text-red-500 mt-1">{createError}</p>}
            {createSuccess && <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1"><Check size={12} /> Cohort created successfully!</p>}
          </form>
        </div>

        {/* Search Section */}
        <div className="px-8 py-4 border-b border-slate-100 bg-white">
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C1D5F] transition-colors" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-lg border border-transparent focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#6C1D5F]/5 text-slate-700 placeholder:text-slate-400 transition-all text-xs outline-none"
              placeholder="Search by batch ID or course name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content / List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1 max-h-[350px]">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading cohorts...</div>
          ) : filteredBatches.map((batch) => {
            const isSelected = localSelection.includes(batch.id);
            const batchStudentsCount = students.filter(s => s.batch?.toLowerCase() === batch.id?.toLowerCase()).length;
            
            return (
              <label
                key={batch.id}
                className={`group flex items-center p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100 active:scale-[0.99] ${
                  isSelected ? "bg-[#6C1D5F]/5 border-[#6C1D5F]/20" : ""
                }`}
              >
                <div className="relative flex items-center">
                  <input
                    checked={isSelected}
                    onChange={() => handleToggle(batch.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#6C1D5F] focus:ring-[#6C1D5F]/20 focus:ring-offset-0 transition-all cursor-pointer accent-[#6C1D5F]"
                    type="checkbox"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-[#653660] bg-[#ffd7f5]">
                        {batch.id}
                      </span>
                      <h3 className="text-[14px] font-bold text-slate-800 mt-1.5">{batch.title}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Users size={14} />
                        <span className="text-xs font-semibold">{batchStudentsCount} Enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
          {!loading && filteredBatches.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No cohorts found matching your search. Create one above!
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-bold">
            <span className="text-[#6C1D5F] font-black">{localSelection.length}</span> {localSelection.length === 1 ? "batch" : "batches"} selected
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all text-xs font-semibold active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              type="button"
              className="px-7 py-2 rounded-lg bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all text-xs font-bold active:scale-95 shadow-sm cursor-pointer"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
