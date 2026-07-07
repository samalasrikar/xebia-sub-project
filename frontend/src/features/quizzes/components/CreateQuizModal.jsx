import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, HelpCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import assignmentService from "@/features/assignments/services/assignmentService";
import quizService from "../services/quizService";
import ScopeSelector from "@/features/assignments/components/ScopeSelector";
import SelectBatchesModal from "@/features/assignments/components/SelectBatchesModal";
import SelectStudentsModal from "@/features/assignments/components/SelectStudentsModal";
import SelectCourseModal from "@/features/assignments/components/SelectCourseModal";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function CreateQuizModal({ isOpen, onClose, quizId, onSave }) {
  const isEdit = !!quizId;

  // Basic info states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  
  // Scope states
  const [scope, setScope] = useState("Entire Course");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [autoAssign, setAutoAssign] = useState(false);

  // Modals state
  const [isBatchesModalOpen, setIsBatchesModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [duration, setDuration] = useState(20);
  const [passingMarks, setPassingMarks] = useState(7);

  // Metadata dropdown options
  const [courses, setCourses] = useState([]);

  // Questions builder state
  const [questions, setQuestions] = useState([
    { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }
  ]);

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Load courses
    assignmentService.getCourses().then(data => {
      setCourses(data || []);
      if (data && data.length > 0) setSelectedCourse(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        quizService.getQuizzes().then(allQuizzes => {
          const quiz = allQuizzes.find(q => q.id === quizId);
          if (quiz) {
            setName(quiz.name || "");
            setDescription(quiz.description || "");
            setSelectedCourse(quiz.courseId || "");
            setDuration(quiz.duration || 20);
            setPassingMarks(quiz.passingMarks || 7);
            setQuestions(quiz.questions && quiz.questions.length > 0 ? quiz.questions : [
              { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }
            ]);

            const sc = quiz.scope || "Entire Course";
            setScope(sc);
            const batchVal = quiz.batch || "";
            if (sc === "Specific Batches") {
              setSelectedBatches(batchVal ? batchVal.split(", ") : []);
              setSelectedStudents([]);
            } else if (sc === "Individual Students") {
              setSelectedStudents(batchVal ? batchVal.split(", ") : []);
              setSelectedBatches([]);
            } else {
              setSelectedBatches([]);
              setSelectedStudents([]);
            }
            setAutoAssign(false);
          }
        });
      } else {
        // Reset
        setName("");
        setDescription("");
        setDuration(20);
        setPassingMarks(7);
        setQuestions([{ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }]);
        setScope("Entire Course");
        setSelectedBatches([]);
        setSelectedStudents([]);
        setAutoAssign(false);
        if (courses.length > 0) setSelectedCourse(courses[0].id);
      }
      setValidationError("");
    }
  }, [isOpen, quizId, isEdit, courses]);

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (status) => {
    setValidationError("");

    if (!name.trim()) {
      setValidationError("Quiz Name is required.");
      return;
    }

    // Verify all questions have required fields if publishing
    if (status === "Published") {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question.trim() || !q.optionA.trim() || !q.optionB.trim() || !q.optionC.trim() || !q.optionD.trim()) {
          setValidationError(`Please complete all fields for Question #${i + 1}.`);
          return;
        }
      }
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
      name: name.trim(),
      description: description.trim(),
      courseId: selectedCourse,
      course: courseTitle,
      module: "",
      submodule: "",
      batch: batchVal,
      scope: scope,
      duration: Number(duration),
      passingMarks: Number(passingMarks),
      questions,
      status
    };

    try {
      if (isEdit) {
        await quizService.updateQuiz(quizId, quizData);
      } else {
        await quizService.createQuiz(quizData);
      }
      onSave();
      onClose();
    } catch (e) {
      const msg = e.response?.data?.data || "An error occurred while saving. Please try again.";
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
              <HelpCircle size={18} className="text-[#6C1D5F]" />
              {isEdit ? "Edit Assessment Quiz" : "Create New Assessment Quiz"}
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Design a manual questionnaire for your students</p>
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

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {validationError && (
            <div className="p-3 bg-red-55 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200/50">
              {validationError}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider">1. Quiz Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Quiz Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Docker Containerization Basics"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none transition-all text-slate-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none transition-all text-slate-800 h-9 font-semibold">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 mt-2">
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
                  <label className="text-[11px] font-semibold text-slate-500">Duration (mins)</label>
                  <Input
                    type="number"
                    min="1"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none transition-all text-slate-800 h-9"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Passing Marks</label>
                  <Input
                    type="number"
                    min="1"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none transition-all text-slate-800 h-9"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Description</label>
              <Textarea
                placeholder="Briefly state the goal of this assessment..."
                rows={2}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-lg text-xs outline-none transition-all text-slate-800 resize-none min-h-[50px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Questions */}
          <div className="space-y-5">
            <div className="flex justify-between items-center border-t border-slate-100 pt-5">
              <h2 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider">2. Questionnaire Builder</h2>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddQuestion}
                className="px-3.5 py-1.5 border-[#6C1D5F] hover:bg-[#6C1D5F]/5 text-[#6C1D5F] text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer h-8"
              >
                <Plus size={14} /> Add Question
              </Button>
            </div>

            <div className="space-y-5">
              {questions.map((q, idx) => (
                <div key={idx} className="p-5 border border-slate-200 rounded-xl bg-slate-50/40 relative space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-700">Question #{idx + 1}</span>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50 cursor-pointer h-7"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400">Question Title / Prompt</label>
                    <Input
                      type="text"
                      placeholder="Enter the question statement..."
                      className="w-full px-3.5 py-1.5 bg-white border border-slate-200 focus:border-slate-350 rounded-lg text-xs outline-none text-slate-800"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Option A</label>
                      <Input
                        type="text"
                        placeholder="Option A"
                        className="w-full px-3.5 py-1.5 bg-white border border-slate-200 focus:border-slate-350 rounded-lg text-xs outline-none text-slate-800"
                        value={q.optionA}
                        onChange={(e) => handleQuestionChange(idx, "optionA", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Option B</label>
                      <Input
                        type="text"
                        placeholder="Option B"
                        className="w-full px-3.5 py-1.5 bg-white border border-slate-200 focus:border-slate-350 rounded-lg text-xs outline-none text-slate-800"
                        value={q.optionB}
                        onChange={(e) => handleQuestionChange(idx, "optionB", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Option C</label>
                      <Input
                        type="text"
                        placeholder="Option C"
                        className="w-full px-3.5 py-1.5 bg-white border border-slate-200 focus:border-slate-350 rounded-lg text-xs outline-none text-slate-800"
                        value={q.optionC}
                        onChange={(e) => handleQuestionChange(idx, "optionC", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Option D</label>
                      <Input
                        type="text"
                        placeholder="Option D"
                        className="w-full px-3.5 py-1.5 bg-white border border-slate-200 focus:border-slate-350 rounded-lg text-xs outline-none text-slate-800"
                        value={q.optionD}
                        onChange={(e) => handleQuestionChange(idx, "optionD", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="sm:w-1/3 space-y-1.5 pt-1">
                    <label className="text-[10px] font-semibold text-slate-500">Correct Answer</label>
                    <Select value={q.correctAnswer} onValueChange={(val) => handleQuestionChange(idx, "correctAnswer", val)}>
                      <SelectTrigger className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-slate-300 outline-none h-8 font-semibold">
                        <SelectValue placeholder="Option A" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Option A</SelectItem>
                        <SelectItem value="B">Option B</SelectItem>
                        <SelectItem value="C">Option C</SelectItem>
                        <SelectItem value="D">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5 flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-5 py-2 border border-slate-200 text-slate-650 bg-white hover:bg-slate-50 transition-all text-xs font-semibold h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit("Draft")}
            variant="secondary"
            className="px-5 py-2 bg-slate-200 hover:bg-slate-250 text-slate-700 transition-all text-xs font-semibold h-9"
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit("Published")}
            className="px-6 py-2 bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all text-xs font-bold shadow-sm h-9"
          >
            Publish Quiz
          </Button>
        </div>
      </DialogContent>

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
    </Dialog>
  );
}
