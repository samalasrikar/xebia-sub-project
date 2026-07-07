import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, FileSpreadsheet, Eye, Edit2, Trash2,
  HelpCircle, Award, BookOpen, Layers, CheckCircle2, ChevronRight, Download
} from "lucide-react";
import AppLayout from "@/app/layouts/AppLayout";
import DeleteDialog from "@/shared/components/DeleteDialog";
import quizService from "../services/quizService";
import assignmentService from "@/features/assignments/services/assignmentService";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

// Modals
import CreateQuizModal from "../components/CreateQuizModal";
import ViewResultsModal from "../components/ViewResultsModal";

export default function QuizDashboard() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [activeTab, setActiveTab] = useState("All Quizzes"); // All Quizzes, Published, Draft, Archived

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statsData, setStatsData] = useState({ total: 0, published: 0, drafts: 0, imported: 0 });
  const [avgScorePercent, setAvgScorePercent] = useState("78%");

  const fetchDashboardData = useCallback(() => {
    quizService.getQuizzes().then(data => setQuizzes(data || [])).catch(() => setQuizzes([]));
    quizService.getQuizStats().then(data => {
      if (data) {
        setStatsData({
          total: data.total,
          published: data.published,
          drafts: data.drafts,
          imported: data.imported
        });
        setAvgScorePercent(data.avgScorePercent || "78%");
      }
    }).catch(() => { });
    assignmentService.getCourses().then(data => setCourses(data || [])).catch(() => setCourses([]));
    assignmentService.getBatches().then(data => setBatches(data || [])).catch(() => setBatches([]));
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Average score and stats are loaded from the backend API.

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await quizService.deleteQuiz(deleteTarget.id);
      setDeleteTarget(null);
      fetchDashboardData();
    }
  };

  // Download Sample format directly
  const handleDownloadSample = () => {
    navigate("/trainer/quizzes/import");
  };

  // Filter logic
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      const matchesSearch = q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const courseObj = courses.find(c => c.id === q.courseId);
      const courseTitle = courseObj ? courseObj.title : q.course;

      const matchesCourse = selectedCourse === "All Courses" ||
        q.courseId === selectedCourse ||
        courseTitle === selectedCourse;

      const matchesBatch = selectedBatch === "All Batches" || q.batch === selectedBatch;

      let matchesTab = true;
      if (activeTab === "Published") matchesTab = q.status === "Published";
      else if (activeTab === "Draft") matchesTab = q.status === "Draft";
      else if (activeTab === "Archived") matchesTab = q.status === "Archived";

      return matchesSearch && matchesCourse && matchesBatch && matchesTab;
    });
  }, [quizzes, searchTerm, selectedCourse, selectedBatch, activeTab, courses]);

  // Stats loaded from backend
  const stats = statsData;

  return (
    <AppLayout>
      <div className="space-y-6" style={{ fontFamily: "'Geist', sans-serif" }}>

        {/* ═══ Page Header ═══ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Quiz Dashboard</h1>
            <p className="text-slate-400 text-xs mt-2">Manage and monitor assessment performance across your courses.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button
              onClick={() => navigate("/trainer/quizzes/import")}
              variant="outline"
              className="text-slate-650 hover:bg-slate-50 transition-all text-xs font-bold rounded-lg bg-white flex items-center gap-1.5 shadow-sm h-9"
            >
              <FileSpreadsheet size={15} />
              <span>Import from Excel</span>
            </Button>
            <Button
              onClick={() => {
                setSelectedQuizId(null);
                setIsCreateOpen(true);
              }}
              className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white transition-all text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm h-9"
            >
              <Plus size={15} />
              <span>Create Quiz</span>
            </Button>
          </div>
        </div>

        {/* ═══ Empty State Check ═══ */}
        {quizzes.length === 0 ? (
          <div className="space-y-8 max-w-4xl mx-auto pt-6">
            {/* Bento empty state card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center p-8 md:p-10 gap-10">
              {/* Left Illustration block */}
              <div className="w-full md:w-5/12 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#6C1D5F]/5 rounded-full scale-110 blur-xl"></div>
                  <HelpCircle size={100} className="text-[#6C1D5F]/20 relative z-10 animate-bounce" style={{ animationDuration: '4s' }} />
                </div>
              </div>

              {/* Right content block */}
              <div className="w-full md:w-7/12 flex flex-col text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-250 mb-4 self-center md:self-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Setup Pending</span>
                </div>
                <h2 className="text-xl font-black text-slate-800 leading-tight mb-2">No Quizzes Found</h2>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-md">
                  Your quiz dashboard is currently empty. Start building your curriculum by creating a new quiz or importing existing data from an Excel file.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="w-full sm:w-auto bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm h-10"
                  >
                    <Plus size={14} />
                    <span>Create New Quiz</span>
                  </Button>
                  <Button
                    onClick={() => navigate("/trainer/quizzes/import")}
                    variant="outline"
                    className="w-full sm:w-auto text-slate-650 hover:bg-slate-100 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 h-10"
                  >
                    <FileSpreadsheet size={14} />
                    <span>Import from Excel</span>
                  </Button>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 w-full text-left">
                  <button
                    onClick={handleDownloadSample}
                    className="flex items-center gap-1.5 text-xs text-[#6C1D5F] font-bold hover:underline"
                  >
                    <Download size={14} />
                    <span>Download Sample Template</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick tips row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-100 p-5 rounded-xl flex gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-0.5">Bulk Upload</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">Import up to 500 questions at once with our Excel template.</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-xl flex gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] shrink-0">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-0.5">AI Generator</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">Generate questions automatically from your course content.</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-xl flex gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-0.5">Proctoring</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">Enable anti-cheat measures in your quiz configurations.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ═══ Standard Dashboard content ═══ */
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-1.5 text-[#6C1D5F]">
                    <HelpCircle size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Quizzes</p>
                  </div>
                  <p className="text-slate-800 text-2xl font-black leading-none">{stats.total}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published</p>
                  </div>
                  <p className="text-slate-800 text-2xl font-black leading-none">{stats.published}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <BookOpen size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Drafts</p>
                  </div>
                  <p className="text-slate-800 text-2xl font-black leading-none">{stats.drafts}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-1.5 text-purple-600">
                    <Layers size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Imported</p>
                  </div>
                  <p className="text-slate-800 text-2xl font-black leading-none">{stats.imported}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#6C1D5F] text-white shadow-sm hover:shadow-md transition-shadow border-transparent">
                <CardContent className="p-5 flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-1.5">
                    <Award size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Avg. Score</p>
                  </div>
                  <p className="text-2xl font-black leading-none">{avgScorePercent}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filter Bar and Tabs Row */}
            <div className="space-y-4 pt-2">
              {/* Tab bar */}
              <div
                role="tablist"
                aria-label="Quiz filter tabs"
                className="flex items-end gap-1 border-b border-slate-200 overflow-x-auto scrollbar-hide"
              >
                {["All Quizzes", "Published", "Draft", "Archived"].map(tab => {
                  let count = quizzes.length;
                  if (tab === "Published") count = quizzes.filter(q => q.status === "Published").length;
                  else if (tab === "Draft") count = quizzes.filter(q => q.status === "Draft").length;
                  else if (tab === "Archived") count = quizzes.filter(q => q.status === "Archived").length;

                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 pb-2.5 px-1 font-bold text-xs whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C1D5F]/40 rounded-sm
                        ${isActive
                          ? "border-[#6C1D5F] text-[#6C1D5F]"
                          : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
                        }`}
                    >
                      <span>{tab}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-colors ${
                        isActive ? "bg-[#6C1D5F]/10 text-[#6C1D5F]" : "bg-slate-100 text-slate-450"
                      }`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filters Panel */}
              <div className="p-4 border border-slate-100 bg-white rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
                <div className="relative group lg:col-span-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C1D5F] transition-colors z-10" />
                  <Input
                    type="text"
                    placeholder="Search by quiz name or description..."
                    className="w-full pl-9 pr-4 bg-slate-50 border-transparent rounded-lg text-xs focus:border-slate-200 focus:bg-white transition-all text-slate-700 font-semibold h-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-full px-3 bg-slate-50 border-transparent rounded-lg text-xs h-8 text-slate-650 font-bold">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Courses">All Courses</SelectItem>
                      {courses.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-full px-3 bg-slate-50 border-transparent rounded-lg text-xs h-8 text-slate-650 font-bold">
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

              {/* Quizzes Table Card */}
              <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                        <TableHead className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Quiz Name</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Course</TableHead>
                        <TableHead className="px-6 py-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Questions</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Status</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Date</TableHead>
                        <TableHead className="px-6 py-4 text-right text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuizzes.map((quiz) => (
                        <TableRow key={quiz.id} className="hover:bg-slate-50/20 transition-colors border-b border-slate-100">
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] flex-shrink-0">
                                <FileSpreadsheet size={15} />
                              </div>
                              <div>
                                <div className="font-bold text-slate-700 text-xs">{quiz.name}</div>
                                {quiz.description && <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{quiz.description}</div>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-slate-500 font-semibold text-xs">{quiz.course}</TableCell>
                          <TableCell className="px-6 py-4 text-center font-bold text-slate-650 text-xs">{quiz.questionsCount || 0}</TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge variant={quiz.status === "Published" ? "default" : "outline"} className={`px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider text-[8.5px] border ${quiz.status === "Published"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-250"
                              }`}>
                              {quiz.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-slate-400 font-semibold text-[11px]">{quiz.createdDate}</TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => {
                                  setSelectedQuizId(quiz.id);
                                  setIsResultsOpen(true);
                                }}
                                title="View Results"
                                className="p-1.5 text-slate-400 hover:text-[#6C1D5F] rounded cursor-pointer"
                              >
                                <Eye size={13} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => {
                                  setSelectedQuizId(quiz.id);
                                  setIsCreateOpen(true);
                                }}
                                title="Edit Quiz"
                                className="p-1.5 text-slate-400 hover:text-[#6C1D5F] rounded cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => setDeleteTarget(quiz)}
                                title="Delete Quiz"
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredQuizzes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-bold text-xs">
                            No quizzes found matching the current filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Dialog Modals */}
      <CreateQuizModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        quizId={selectedQuizId}
        onSave={fetchDashboardData}
      />

      <ViewResultsModal
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
        quizId={selectedQuizId}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={!!deleteTarget}
        title="Delete Quiz"
        itemName={deleteTarget?.name}
        description="Are you sure you want to permanently delete this quiz assessment? This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
}
