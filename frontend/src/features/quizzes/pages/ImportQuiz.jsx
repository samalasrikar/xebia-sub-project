import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, Upload, FileSpreadsheet, Trash2, Edit2, AlertCircle, 
  CheckCircle2, Download, ChevronRight, ChevronLeft, Copy, Check 
} from "lucide-react";
import * as XLSX from "xlsx";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "@/features/assignments/services/assignmentService";
import quizService from "../services/quizService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import ScopeSelector from "@/features/assignments/components/ScopeSelector";
import SelectBatchesModal from "@/features/assignments/components/SelectBatchesModal";
import SelectStudentsModal from "@/features/assignments/components/SelectStudentsModal";
import SelectCourseModal from "@/features/assignments/components/SelectCourseModal";

export default function ImportQuiz() {
  const navigate = useNavigate();

  // Wizard Step: 1 = Upload & Configure, 2 = Processing, 3 = Preview, 4 = Review & Publish, 5 = Success
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  // File state
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Quiz Metadata fields
  const [quizName, setQuizName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("c1");
  
  // Scope states
  const [scope, setScope] = useState("Entire Course");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [autoAssign, setAutoAssign] = useState(false);

  // Modals state
  const [isBatchesModalOpen, setIsBatchesModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [passingMarksPercent, setPassingMarksPercent] = useState(70);
  const [duration, setDuration] = useState(30);

  // Loaded metadata options
  const [courses, setCourses] = useState([]);

  // Parsed Questionnaire
  const [questions, setQuestions] = useState([]);
  const [isEditingIdx, setIsEditingIdx] = useState(null);

  // Editing single question state
  const [editQ, setEditQ] = useState("");
  const [editOptA, setEditOptA] = useState("");
  const [editOptB, setEditOptB] = useState("");
  const [editOptC, setEditOptC] = useState("");
  const [editOptD, setEditOptD] = useState("");
  const [editAns, setEditAns] = useState("A");

  // Filtering / Sorting in Preview
  const [previewFilter, setPreviewFilter] = useState("All"); // All, Valid, Invalid, Warnings
  const [previewDifficultyFilter, setPreviewDifficultyFilter] = useState("All");

  useEffect(() => {
    assignmentService.getCourses().then(data => {
      setCourses(data || []);
      if (data && data.length > 0) setSelectedCourse(data[0].id);
    });
  }, []);

  // Format Helper for sample template download
  const handleDownloadSample = () => {
    const data = [
      {
        "Question": "What is the primary architectural pattern used in React?",
        "Option A": "Model-View-Controller (MVC)",
        "Option B": "Flux Pattern",
        "Option C": "Component-based Architecture",
        "Option D": "Monolithic Service",
        "Correct Answer": "C"
      },
      {
        "Question": "Which React hook is used to manage local state inside a functional component?",
        "Option A": "useEffect",
        "Option B": "useState",
        "Option C": "useContext",
        "Option D": "useReducer",
        "Correct Answer": "B"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Questions");
    XLSX.writeFile(workbook, "quiz_import_template.xlsx");
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setValidationError("");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setValidationError("");
    }
  };

  // Run sheetJS parse & proceed to progress/processing
  const handleImportQuestions = () => {
    if (!quizName.trim()) {
      setValidationError("Quiz Name is required.");
      return;
    }
    if (!file) {
      setValidationError("Please select or drop an Excel spreadsheet file.");
      return;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      setValidationError("Unsupported file format. Please upload .xlsx or .xls files.");
      return;
    }

    // Go to Processing Step
    setStep(2);
    setProgress(10);

    const reader = new FileReader();

    // Animate progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 250);

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse rows
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // Map and validate questions
        const parsed = rows.map((row, idx) => {
          const rawQ = row["Question"] || row["question"] || "";
          const optA = String(row["Option A"] || row["optionA"] || row["option a"] || "");
          const optB = String(row["Option B"] || row["optionB"] || row["option b"] || "");
          const optC = String(row["Option C"] || row["optionC"] || row["option c"] || "");
          const optD = String(row["Option D"] || row["optionD"] || row["option d"] || "");
          const ansRaw = String(row["Correct Answer"] || row["correctAnswer"] || row["correct answer"] || "").toUpperCase().trim();

          const isValid = rawQ.trim() !== "" &&
                          optA.trim() !== "" &&
                          optB.trim() !== "" &&
                          optC.trim() !== "" &&
                          optD.trim() !== "" &&
                          ["A", "B", "C", "D"].includes(ansRaw);

          return {
            id: `imported-${idx}-${Date.now()}`,
            question: rawQ,
            optionA: optA,
            optionB: optB,
            optionC: optC,
            optionD: optD,
            correctAnswer: ["A", "B", "C", "D"].includes(ansRaw) ? ansRaw : "A",
            isValid
          };
        });

        setTimeout(() => {
          clearInterval(interval);
          setProgress(100);
          setQuestions(parsed);
          setStep(3); // Go to Preview
        }, 1200);

      } catch (err) {
        clearInterval(interval);
        setValidationError("Failed to parse the Excel file. Please check its structure.");
        setStep(1);
        setFile(null);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Preview management actions
  const startEditQuestion = (index) => {
    const q = questions[index];
    setIsEditingIdx(index);
    setEditQ(q.question);
    setEditOptA(q.optionA);
    setEditOptB(q.optionB);
    setEditOptC(q.optionC);
    setEditOptD(q.optionD);
    setEditAns(q.correctAnswer);
  };

  const saveEditQuestion = (index) => {
    const isValid = editQ.trim() !== "" &&
                    editOptA.trim() !== "" &&
                    editOptB.trim() !== "" &&
                    editOptC.trim() !== "" &&
                    editOptD.trim() !== "" &&
                    ["A", "B", "C", "D"].includes(editAns);

    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        question: editQ.trim(),
        optionA: editOptA.trim(),
        optionB: editOptB.trim(),
        optionC: editOptC.trim(),
        optionD: editOptD.trim(),
        correctAnswer: editAns,
        isValid
      };
      return updated;
    });
    setIsEditingIdx(null);
  };

  const duplicateQuestion = (index) => {
    const q = questions[index];
    setQuestions(prev => {
      const copy = { ...q, id: `copied-${Date.now()}` };
      const updated = [...prev];
      updated.splice(index + 1, 0, copy);
      return updated;
    });
  };

  const deleteQuestion = (index) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== index));
  };

  // Statistics computations
  const totalQuestions = questions.length;
  const validQuestions = questions.filter(q => q.isValid).length;
  const invalidQuestions = totalQuestions - validQuestions;

  // Duplicate questionnaire lookup (by question text)
  const duplicateQuestionsCount = useMemo(() => {
    return questions.filter((q, idx) => {
      return questions.findIndex(other => other.question.trim().toLowerCase() === q.question.trim().toLowerCase()) !== idx;
    }).length;
  }, [questions]);

  // Filtering preview questionnaire
  const filteredQuestions = useMemo(() => {
    return questions.filter((q, idx) => {
      const isDup = questions.findIndex(other => other.question.trim().toLowerCase() === q.question.trim().toLowerCase()) !== idx;
      
      if (previewFilter === "Valid" && !q.isValid) return false;
      if (previewFilter === "Invalid" && q.isValid) return false;
      if (previewFilter === "Warnings" && !isDup) return false;

      return true;
    });
  }, [questions, previewFilter]);

  // Final submission publish or draft save
  const handlePublish = async (status) => {
    setValidationError("");

    if (!quizName.trim()) {
      setValidationError("Quiz Name is required.");
      return;
    }

    const courseObj = courses.find(c => c.id === selectedCourse);
    const courseTitle = courseObj ? courseObj.title : "Cloud Native Engineering";

    let batchVal = "";
    if (scope === "Specific Batches") {
      batchVal = selectedBatches.length > 0 ? selectedBatches.join(", ") : "";
    } else if (scope === "Individual Students") {
      batchVal = selectedStudents.length > 0 ? selectedStudents.join(", ") : "";
    }

    const quizData = {
      name: quizName.trim(),
      description: description.trim(),
      courseId: selectedCourse,
      course: courseTitle,
      batch: batchVal,
      scope: scope,
      duration: parseInt(duration) || 30,
      passingMarks: Math.ceil(totalQuestions * (passingMarksPercent / 100)),
      questions: questions.map(({ question, optionA, optionB, optionC, optionD, correctAnswer }) => ({
        question, optionA, optionB, optionC, optionD, correctAnswer
      })),
      status
    };

    try {
      await quizService.createQuiz(quizData);
      setStep(5); // Success state
    } catch (e) {
      const msg = e.response?.data?.data || "Failed to publish imported quiz. Try again.";
      setValidationError(msg);
    }
  };

  const handleDiscard = () => {
    setFile(null);
    setValidationError("");
    setQuestions([]);
    setStep(1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* ═══ Header & Breadcrumbs ═══ */}
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            <span>Quiz Management</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-[#6C1D5F] font-bold">Import Quiz</span>
          </nav>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Bulk Import Quiz
          </h1>
          <p className="text-xs text-slate-400">Upload structured Excel sheets to import questions and build modular assessments quickly.</p>
        </div>

        {/* ═══ STEP 1: Upload & Configure ═══ */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form settings + Upload Box (cols: 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {validationError && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200/50 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Form card */}
              <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-2 text-[#6C1D5F] border-b border-slate-100 pb-3">
                  <FileSpreadsheet size={16} />
                  <h3 className="text-xs font-black uppercase tracking-wider">Quiz General Settings</h3>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quiz Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Advanced React Architecture Assessment"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] transition-all text-slate-700 font-semibold"
                      value={quizName}
                      onChange={(e) => setQuizName(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                    <textarea 
                      placeholder="Enter quiz objectives or general descriptions..."
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] transition-all text-slate-700 resize-none"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>



                  <div className="md:col-span-2">
                    <ScopeSelector
                      scope={scope}
                      onChange={(field, value) => {
                        if (field === "scope") setScope(value);
                      }}
                      selectedBatches={selectedBatches}
                      selectedStudents={selectedStudents}
                      autoAssign={autoAssign}
                      onOpenBatchesModal={() => setIsBatchesModalOpen(true)}
                      onOpenStudentsModal={() => setIsStudentsModalOpen(true)}
                      onOpenCourseModal={() => setIsCourseModalOpen(true)}
                    />
                  </div>



                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passing Marks (%)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          className="w-full px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] text-slate-700 font-semibold"
                          value={passingMarksPercent}
                          onChange={(e) => setPassingMarksPercent(e.target.value)}
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration (Mins)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          className="w-full px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] text-slate-700 font-semibold"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">min</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Drag & Drop Excel box */}
              <div
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isDragActive 
                    ? "border-[#6C1D5F] bg-[#6C1D5F]/5" 
                    : "border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50/20"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-16 h-16 bg-[#6C1D5F]/10 rounded-full flex items-center justify-center text-[#6C1D5F] mb-4">
                  <Upload size={28} />
                </div>
                <h4 className="text-sm font-black text-slate-700">Upload Quiz Spreadsheet</h4>
                <p className="text-xs text-slate-400 mt-1 mb-5 max-w-sm">Drag and drop your spreadsheet here, or <span className="text-[#6C1D5F] font-bold underline">browse files</span>.</p>
                
                <div className="flex gap-4 text-[10px] text-slate-405 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> .xlsx</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> .xls</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> MAX 10MB</span>
                </div>

                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".xlsx, .xls"
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>

              {/* Show selected file banner */}
              {file && (
                <div className="border border-slate-150 rounded-xl p-4 flex items-center justify-between bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-700">{file.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}

              {/* Wizard Nav buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => navigate("/trainer/quizzes")}
                  className="px-6 py-2.5 text-slate-650 hover:bg-slate-100 rounded-lg font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportQuestions}
                  className="px-8 py-2.5 bg-[#6C1D5F] text-white font-bold rounded-lg shadow-sm hover:bg-[#4A1E47] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Import Questions</span>
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>

            {/* Sidebar guides (cols: 4) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Sample Template */}
              <div className="bg-[#6C1D5F] text-white p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12"></div>
                <div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <FileSpreadsheet size={20} />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">Standard template</h4>
                  <h3 className="text-md font-black leading-tight mb-2">Standardized Formats</h3>
                  <p className="text-white/80 text-xs leading-relaxed mb-6">Download our standardized template spreadsheet to ensure structure compatibility and error-free rendering.</p>
                </div>
                <button
                  onClick={handleDownloadSample}
                  className="w-full py-2.5 bg-white text-[#6C1D5F] font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all text-xs cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Template</span>
                </button>
              </div>

              {/* Help tip */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-500" />
                  Format Requirements
                </h4>
                <ul className="space-y-2 text-xs text-slate-500 pl-4 list-disc">
                  <li>Row 1 must be headers: <strong>Question, Option A, Option B, Option C, Option D, Correct Answer</strong>.</li>
                  <li>Correct Answer column must be exactly <strong>A, B, C, or D</strong>.</li>
                  <li>Do not add merged cells or custom styling in sheet rows.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        {/* ═══ STEP 2: Processing Excel ═══ */}
        {step === 2 && (
          <div className="bg-white border border-slate-100 rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[#6C1D5F]/10 text-[#6C1D5F] rounded-full flex items-center justify-center animate-pulse">
              <FileSpreadsheet size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-md font-black text-slate-800">Processing Assessment Spreadsheet</h3>
              <p className="text-xs text-slate-400 max-w-sm">Reading table grids, matching columns, and performing integrity checks...</p>
            </div>
            
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>PARSING PROGRESS</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#6C1D5F] h-full transition-all duration-300 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Preview & Validation ═══ */}
        {step === 3 && (
          <div className="space-y-6">
            
            {/* Header statistics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between h-24">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Questions</span>
                  <FileSpreadsheet size={15} />
                </div>
                <p className="text-slate-800 text-2xl font-black">{totalQuestions}</p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm flex flex-col justify-between h-24">
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Valid Rows</span>
                  <CheckCircle2 size={15} />
                </div>
                <p className="text-emerald-700 text-2xl font-black">{validQuestions}</p>
              </div>

              <div className={`border rounded-xl p-5 shadow-sm flex flex-col justify-between h-24 ${
                invalidQuestions > 0 ? "bg-red-50/50 border-red-150" : "bg-white border-slate-100"
              }`}>
                <div className={`flex justify-between items-center ${invalidQuestions > 0 ? "text-red-500" : "text-slate-400"}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Invalid Rows</span>
                  <AlertCircle size={15} />
                </div>
                <p className={`text-2xl font-black ${invalidQuestions > 0 ? "text-red-700" : "text-slate-800"}`}>
                  {invalidQuestions}
                </p>
              </div>

              <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-5 shadow-sm flex flex-col justify-between h-24">
                <div className="flex justify-between items-center text-amber-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Duplicate Warning</span>
                  <Copy size={14} />
                </div>
                <p className="text-amber-700 text-2xl font-black">{duplicateQuestionsCount}</p>
              </div>
            </div>

            {/* Filter and Top buttons bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
              <div className="flex gap-2 flex-wrap">
                {["All", "Valid", "Invalid", "Warnings"].map(f => {
                  let badgeVal = totalQuestions;
                  let colorClass = "bg-slate-100 text-slate-650";
                  if (f === "Valid") { badgeVal = validQuestions; colorClass = "bg-emerald-100 text-emerald-800"; }
                  if (f === "Invalid") { badgeVal = invalidQuestions; colorClass = "bg-red-100 text-red-800"; }
                  if (f === "Warnings") { badgeVal = duplicateQuestionsCount; colorClass = "bg-amber-100 text-amber-800"; }

                  return (
                    <button
                      key={f}
                      onClick={() => setPreviewFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                        previewFilter === f
                          ? "border-[#6C1D5F] bg-[#6C1D5F]/5 text-[#6C1D5F]"
                          : "border-slate-200 hover:bg-slate-50 text-slate-500"
                      }`}
                    >
                      <span>{f} Questions</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colorClass}`}>
                        {badgeVal}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDiscard}
                  className="px-4 py-2 border border-slate-200 text-slate-550 font-bold rounded-lg hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Discard Import
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2 bg-[#6C1D5F] text-white font-bold rounded-lg shadow-sm hover:bg-[#4A1E47] transition-all text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Proceed to Review</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Questions listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((q, qIdx) => {
                const globalIdx = questions.findIndex(item => item.id === q.id);
                const isEditing = isEditingIdx === globalIdx;
                const isDuplicate = questions.findIndex(other => other.question.trim().toLowerCase() === q.question.trim().toLowerCase()) !== globalIdx;

                return (
                  <div 
                    key={q.id}
                    className={`bg-white border rounded-xl p-5 shadow-sm relative group flex flex-col justify-between min-h-[220px] transition-all hover:shadow-md ${
                      !q.isValid 
                        ? "border-red-200 bg-red-50/10" 
                        : isDuplicate 
                          ? "border-amber-200 bg-amber-50/10" 
                          : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div>
                      {/* Badge / Actions Row */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-black text-slate-400">QUESTION #{globalIdx + 1}</span>
                          {!q.isValid ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded-full font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-0.5">
                              <AlertCircle size={9} /> Invalid
                            </span>
                          ) : isDuplicate ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-0.5">
                              <AlertCircle size={9} /> Duplicate
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-250 rounded-full font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-0.5">
                              <CheckCircle2 size={9} /> Valid
                            </span>
                          )}
                        </div>

                        {/* Hover action controls */}
                        <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditQuestion(globalIdx)}
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#6C1D5F] rounded transition-all cursor-pointer"
                            title="Edit Question"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => duplicateQuestion(globalIdx)}
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#6C1D5F] rounded transition-all cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            onClick={() => deleteQuestion(globalIdx)}
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Display Question details or Inline Edit form */}
                      {isEditing ? (
                        <div className="space-y-3 pt-1">
                          <textarea 
                            className="w-full p-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] text-slate-700 font-semibold"
                            value={editQ}
                            onChange={(e) => setEditQ(e.target.value)}
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <input 
                              placeholder="Option A" 
                              className="px-2 py-1 border border-slate-200 rounded-md outline-none text-slate-650"
                              value={editOptA}
                              onChange={(e) => setEditOptA(e.target.value)}
                            />
                            <input 
                              placeholder="Option B" 
                              className="px-2 py-1 border border-slate-200 rounded-md outline-none text-slate-650"
                              value={editOptB}
                              onChange={(e) => setEditOptB(e.target.value)}
                            />
                            <input 
                              placeholder="Option C" 
                              className="px-2 py-1 border border-slate-200 rounded-md outline-none text-slate-650"
                              value={editOptC}
                              onChange={(e) => setEditOptC(e.target.value)}
                            />
                            <input 
                              placeholder="Option D" 
                              className="px-2 py-1 border border-slate-200 rounded-md outline-none text-slate-650"
                              value={editOptD}
                              onChange={(e) => setEditOptD(e.target.value)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between gap-4 pt-1">
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <span>Correct Option:</span>
                              <Select value={editAns} onValueChange={setEditAns}>
                                <SelectTrigger className="px-2 py-0.5 border border-slate-200 rounded cursor-pointer text-slate-750 font-bold bg-white h-7 w-16">
                                  <SelectValue placeholder="A" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="B">B</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="D">D</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setIsEditingIdx(null)}
                                className="px-2.5 py-1 text-slate-400 hover:bg-slate-100 rounded text-[10px] font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveEditQuestion(globalIdx)}
                                className="px-3.5 py-1 bg-[#6C1D5F] text-white rounded text-[10px] font-bold hover:bg-[#4A1E47] cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-750 leading-relaxed">{q.question}</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {["A", "B", "C", "D"].map(optKey => {
                              const isCorrect = q.correctAnswer === optKey;
                              const optText = q[`option${optKey}`];
                              return (
                                <div 
                                  key={optKey}
                                  className={`p-2 rounded-lg text-[11px] flex items-center gap-2 border transition-all ${
                                    isCorrect 
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold" 
                                      : "bg-slate-50/50 border-slate-100 text-slate-500"
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold border text-[10px] ${
                                    isCorrect
                                      ? "bg-emerald-500 border-emerald-500 text-white"
                                      : "bg-slate-100 border-slate-200 text-slate-500"
                                  }`}>{optKey}</span>
                                  <span className="line-clamp-1">{optText || <em className="text-red-400 font-normal">Missing content</em>}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredQuestions.length === 0 && (
                <div className="col-span-2 text-center py-16 text-slate-400 font-bold text-xs">
                  No questions match the active status filter.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ═══ STEP 4: Review & Publish ═══ */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {validationError && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200/50 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Overview summary card */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-2 text-[#6C1D5F] border-b border-slate-100 pb-3">
                <CheckCircle2 size={16} />
                <h3 className="text-xs font-black uppercase tracking-wider">Review Quiz Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Quiz Name</h4>
                  <p className="text-xs font-bold text-slate-800 mt-1">{quizName}</p>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Description</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description || "No description provided."}</p>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Course Module</h4>
                  <p className="text-xs text-slate-700 mt-1 font-semibold">
                    {courses.find(c => c.id === selectedCourse)?.title || selectedCourse}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Assignment Scope</h4>
                  <p className="text-xs text-slate-700 mt-1 font-semibold">
                    {scope}
                    {scope === "Specific Batches" && selectedBatches.length > 0 && ` (${selectedBatches.join(", ")})`}
                    {scope === "Individual Students" && selectedStudents.length > 0 && ` (${selectedStudents.join(", ")})`}
                  </p>
                </div>
                 <div>
                  <h4 className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Quiz Parameters</h4>
                  <p className="text-xs text-slate-700 mt-1 font-semibold">
                    {duration} Mins | Passing {passingMarksPercent}%
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Imported Questions</h4>
                  <p className="text-xs text-slate-700 mt-1 font-bold text-emerald-600">{totalQuestions} Valid Questions</p>
                </div>
              </div>
            </div>

            {/* Warn if there are duplicates */}
            {duplicateQuestionsCount > 0 && (
              <div className="p-4 bg-amber-50 text-amber-800 text-xs font-semibold rounded-xl border border-amber-250/50 flex items-start gap-2.5">
                <AlertCircle size={16} className="mt-0.5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-bold">Duplicate Warning</p>
                  <p className="font-normal text-amber-700/80 mt-0.5">We found {duplicateQuestionsCount} duplicate questions inside this spreadsheet. We will import all of them, but you can clean them up if needed.</p>
                </div>
              </div>
            )}

            {/* Final navigation button row */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Back to Preview
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handlePublish("Draft")}
                  className="px-5 py-2.5 border border-slate-250 text-slate-700 font-bold rounded-lg hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handlePublish("Published")}
                  className="px-8 py-2.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold rounded-lg shadow-sm transition-all text-xs cursor-pointer"
                >
                  Publish Quiz
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ═══ STEP 5: Success State ═══ */}
        {step === 5 && (
          <div className="bg-white border border-slate-100 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Quiz Assessment Created!</h2>
              <p className="text-xs text-slate-400 max-w-md">Your imported assessment sheet has been compiled and saved successfully to database endpoints.</p>
            </div>

            <div className="w-full bg-slate-50 rounded-xl p-5 max-w-md grid grid-cols-2 gap-4 text-left border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">QUIZ NAME</span>
                <p className="font-bold text-slate-700 mt-0.5 line-clamp-1">{quizName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">TOTAL QUESTIONS</span>
                <p className="font-bold text-slate-700 mt-0.5">{totalQuestions}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">TARGET COURSE</span>
                <p className="font-bold text-slate-750 mt-0.5 line-clamp-1">
                  {courses.find(c => c.id === selectedCourse)?.title || selectedCourse}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">TARGET SCOPE</span>
                <p className="font-bold text-slate-700 mt-0.5">
                  {scope}
                  {scope === "Specific Batches" && selectedBatches.length > 0 && ` (${selectedBatches.join(", ")})`}
                  {scope === "Individual Students" && selectedStudents.length > 0 && ` (${selectedStudents.join(", ")})`}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/trainer/quizzes")}
              className="px-8 py-3 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold rounded-lg shadow-sm text-xs transition-all cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        )}

      </div>

      {isBatchesModalOpen && (
        <SelectBatchesModal
          isOpen={isBatchesModalOpen}
          onClose={() => setIsBatchesModalOpen(false)}
          selectedBatches={selectedBatches}
          onApply={(batches) => setSelectedBatches(batches)}
        />
      )}
      {isStudentsModalOpen && (
        <SelectStudentsModal
          isOpen={isStudentsModalOpen}
          onClose={() => setIsStudentsModalOpen(false)}
          selectedStudents={selectedStudents}
          onApply={(students) => setSelectedStudents(students)}
        />
      )}
      {isCourseModalOpen && (
        <SelectCourseModal
          isOpen={isCourseModalOpen}
          onClose={() => setIsCourseModalOpen(false)}
          autoAssign={autoAssign}
          onApply={(val) => setAutoAssign(val)}
        />
      )}
    </AppLayout>
  );
}
