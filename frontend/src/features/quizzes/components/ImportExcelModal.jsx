import React, { useState, useRef, useEffect } from "react";
import { X, Upload, FileSpreadsheet, Trash2, Edit2, AlertCircle, CheckCircle, Download } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import * as XLSX from "xlsx";
import assignmentService from "@/features/assignments/services/assignmentService";
import quizService from "../services/quizService";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Progress } from "@/shared/components/ui/progress";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function ImportExcelModal({ isOpen, onClose, onSave }) {
  // File states
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Parsed Questions states
  const [questions, setQuestions] = useState([]);
  const [isEditingIdx, setIsEditingIdx] = useState(null);
  
  // Edit Question fields
  const [editQ, setEditQ] = useState("");
  const [editOptA, setEditOptA] = useState("");
  const [editOptB, setEditOptB] = useState("");
  const [editOptC, setEditOptC] = useState("");
  const [editOptD, setEditOptD] = useState("");
  const [editAns, setEditAns] = useState("A");

  // Metadata dropdowns
  const [name, setName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    assignmentService.getCourses().then(data => {
      setCourses(data || []);
      if (data && data.length > 0) setSelectedCourse(data[0].id);
    });
    assignmentService.getBatches().then(data => {
      setBatches(data || []);
      if (data && data.length > 0) setSelectedBatch(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setProgress(0);
      setQuestions([]);
      setIsEditingIdx(null);
      setName("");
      setValidationError("");
    }
  }, [isOpen]);

  // Download Sample Excel using SheetJS
  const handleDownloadSample = () => {
    const data = [
      {
        "Question": "What is the virtual DOM in React?",
        "Option A": "A direct representation of the HTML DOM",
        "Option B": "A lightweight JavaScript representation of the DOM cached in memory",
        "Option C": "A CSS framework for routing pages",
        "Option D": "A server-side scripting module",
        "Correct Answer": "B"
      },
      {
        "Question": "Which standard command builds a production-ready application in Vite?",
        "Option A": "vite start",
        "Option B": "vite compile",
        "Option C": "vite build",
        "Option D": "vite assemble",
        "Correct Answer": "C"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Questions");
    
    // Generate Buffer & download
    XLSX.writeFile(workbook, "quiz_import_sample.xlsx");
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      setValidationError("Unsupported file format. Please upload .xlsx or .xls files.");
      return;
    }

    setFile(selectedFile);
    setValidationError("");
    setProgress(10);

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent * 0.9); // Reserve 10% for parsing
      }
    };

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse rows as JSON array
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // Map & Validate Questions
        const parsedQuestions = rows.map((row, idx) => {
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

        setQuestions(parsedQuestions);
        setProgress(100);
      } catch (err) {
        setValidationError("Failed to parse the Excel file. Please check its structure.");
        setFile(null);
        setProgress(0);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setQuestions([]);
    setIsEditingIdx(null);
    setValidationError("");
  };

  // Inline Edit Question
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

  const deleteQuestion = (index) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== index));
  };

  // Computations
  const totalQuestions = questions.length;
  const validQuestions = questions.filter(q => q.isValid).length;
  const invalidQuestions = totalQuestions - validQuestions;

  // Let's identify duplicates based on exact question text match
  const duplicateQuestions = questions.filter((q, idx) => {
    return questions.findIndex(other => other.question.trim().toLowerCase() === q.question.trim().toLowerCase()) !== idx;
  }).length;

  const handleSubmit = async (status) => {
    setValidationError("");

    if (!name.trim()) {
      setValidationError("Quiz Name is required.");
      return;
    }

    if (totalQuestions === 0) {
      setValidationError("Please import at least one question.");
      return;
    }

    // Verify no remaining invalid questions if publishing
    if (status === "Published" && invalidQuestions > 0) {
      setValidationError("Please correct all highlighted validation errors before publishing.");
      return;
    }

    const courseObj = courses.find(c => c.id === selectedCourse);
    const courseTitle = courseObj ? courseObj.title : "Cloud Native Engineering";

    const quizData = {
      name: name.trim(),
      courseId: selectedCourse,
      course: courseTitle,
      batch: selectedBatch,
      duration: 30, // Default duration
      passingMarks: Math.ceil(totalQuestions * 0.7), // 70% passing threshold
      questions: questions.map(({ question, optionA, optionB, optionC, optionD, correctAnswer }) => ({
        question, optionA, optionB, optionC, optionD, correctAnswer
      })),
      status
    };

    try {
      await quizService.createQuiz(quizData);
      onSave();
      onClose();
    } catch (e) {
      const msg = e.response?.data?.data || "Failed to publish imported quiz. Try again.";
      setValidationError(msg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] md:w-[850px] max-w-full max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-[#6C1D5F]" />
              Import Quiz from Excel
            </h1>
            <p className="text-[11px] text-slate-405 text-slate-400 mt-0.5">Parse, validate, and build assessments from spreadsheets</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon-xs"
            className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {validationError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200/50">
              {validationError}
            </div>
          )}

          {/* Section 1: Drop file or Browse */}
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                isDragActive ? "border-[#6C1D5F] bg-[#6C1D5F]/5" : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] rounded-full mb-3">
                <Upload size={24} />
              </div>
              <p className="text-xs font-bold text-slate-700">Drag and drop your spreadsheet here</p>
              <p className="text-[10px] text-slate-400 mt-1">Accepts .xlsx and .xls file formats</p>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-1.5 bg-[#6C1D5F] text-white text-xs font-bold rounded-lg hover:bg-[#4A1E47] transition-all cursor-pointer h-8"
                >
                  Browse Files
                </Button>
                <Button
                  onClick={handleDownloadSample}
                  variant="outline"
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer h-8"
                >
                  <Download size={13} /> Sample Template
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            /* Upload Progress and File display */
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-700">{file.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  {progress < 100 && (
                    <Progress value={progress} className="w-48 bg-slate-200 mt-1.5 h-1 [&>div]:bg-[#6C1D5F]" />
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleRemoveFile}
                className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all cursor-pointer"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}

          {/* Section 2: Quiz Metadata Config */}
          {questions.length > 0 && (
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <h2 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider">1. Assessment Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Quiz Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Kubernetes Cluster Config"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none text-slate-800 h-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none text-slate-800 h-9 font-semibold">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Target Cohort / Batch</label>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none text-slate-800 h-9 font-semibold">
                      <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.id} - {b.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                <Card className="bg-slate-50/70 border border-slate-100 shadow-none">
                  <CardContent className="p-3 flex flex-col gap-1 w-full">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Questions</span>
                    <div className="text-lg font-black text-slate-800 mt-0.5">{totalQuestions}</div>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50/50 border border-emerald-100 shadow-none">
                  <CardContent className="p-3 flex flex-col gap-1 w-full">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Valid Rows</span>
                    <div className="text-lg font-black text-emerald-700 mt-0.5">{validQuestions}</div>
                  </CardContent>
                </Card>
                <Card className={`border shadow-none ${invalidQuestions > 0 ? "bg-red-50/50 border-red-100" : "bg-slate-50/70 border-slate-100"}`}>
                  <CardContent className="p-3 flex flex-col gap-1 w-full">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${invalidQuestions > 0 ? "text-red-500" : "text-slate-400"}`}>Invalid Rows</span>
                    <div className={`text-lg font-black mt-0.5 ${invalidQuestions > 0 ? "text-red-700" : "text-slate-800"}`}>{invalidQuestions}</div>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50/50 border border-amber-100 shadow-none">
                  <CardContent className="p-3 flex flex-col gap-1 w-full">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Duplicates</span>
                    <div className="text-lg font-black text-amber-700 mt-0.5">{duplicateQuestions}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Section 3: Question Preview List */}
          {questions.length > 0 && (
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <h2 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider">2. Imported Questionnaire</h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isEditing = isEditingIdx === idx;
                  const isDuplicate = questions.findIndex(other => other.question.trim().toLowerCase() === q.question.trim().toLowerCase()) !== idx;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 border rounded-xl transition-all relative ${
                        !q.isValid
                          ? "border-red-200 bg-red-50/20"
                          : isDuplicate
                          ? "border-amber-200 bg-amber-50/15"
                          : "border-slate-200 bg-slate-50/20"
                      }`}
                    >
                      {/* Actions bar */}
                      <div className="absolute right-4 top-4 flex gap-2">
                        {isEditing ? (
                          <Button
                            onClick={() => saveEditQuestion(idx)}
                            className="px-2.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 transition-colors cursor-pointer h-6"
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => startEditQuestion(idx)}
                            className="p-1 text-slate-505 text-slate-500 hover:text-[#6C1D5F] cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => deleteQuestion(idx)}
                          className="p-1 text-slate-505 text-slate-500 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>

                      {/* Content Form / Display */}
                      <div className="space-y-2.5 pr-14">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question #{idx + 1}</span>
                          {!q.isValid && (
                            <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <AlertCircle size={10} /> Needs Attention
                            </span>
                          )}
                          {isDuplicate && q.isValid && (
                            <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <AlertCircle size={10} /> Duplicate Row
                            </span>
                          )}
                          {q.isValid && !isDuplicate && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle size={10} /> Verified
                            </span>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-2 mt-1.5">
                            <Input
                              type="text"
                              className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:border-[#6C1D5F] outline-none h-8 font-semibold"
                              value={editQ}
                              onChange={(e) => setEditQ(e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="text"
                                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:border-[#6C1D5F] outline-none h-8"
                                value={editOptA}
                                onChange={(e) => setEditOptA(e.target.value)}
                                placeholder="Option A"
                              />
                              <Input
                                type="text"
                                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:border-[#6C1D5F] outline-none h-8"
                                value={editOptB}
                                onChange={(e) => setEditOptB(e.target.value)}
                                placeholder="Option B"
                              />
                              <Input
                                type="text"
                                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:border-[#6C1D5F] outline-none h-8"
                                value={editOptC}
                                onChange={(e) => setEditOptC(e.target.value)}
                                placeholder="Option C"
                              />
                              <Input
                                type="text"
                                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:border-[#6C1D5F] outline-none h-8"
                                value={editOptD}
                                onChange={(e) => setEditOptD(e.target.value)}
                                placeholder="Option D"
                              />
                            </div>
                            <Select value={editAns} onValueChange={setEditAns}>
                              <SelectTrigger className="px-2 bg-white border border-slate-200 rounded text-xs outline-none cursor-pointer h-8 font-semibold w-24">
                                <SelectValue placeholder="Option A" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-800">{q.question || <span className="text-red-500 italic">[Empty Question]</span>}</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                              <div>A: {q.optionA || <span className="text-red-500 italic">[Empty]</span>}</div>
                              <div>B: {q.optionB || <span className="text-red-500 italic">[Empty]</span>}</div>
                              <div>C: {q.optionC || <span className="text-red-500 italic">[Empty]</span>}</div>
                              <div>D: {q.optionD || <span className="text-red-500 italic">[Empty]</span>}</div>
                            </div>
                            <div className="text-[10px] font-bold text-emerald-600">Correct Option: {q.correctAnswer}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5 flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-5 py-2 border border-slate-200 text-slate-655 text-slate-600 bg-white hover:bg-slate-50 transition-all text-xs font-semibold h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit("Draft")}
            disabled={totalQuestions === 0}
            variant="secondary"
            className="px-5 py-2 bg-slate-200 hover:bg-slate-250 text-slate-700 transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-9"
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit("Published")}
            disabled={totalQuestions === 0}
            className="px-6 py-2 bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-9"
          >
            Publish Quiz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
