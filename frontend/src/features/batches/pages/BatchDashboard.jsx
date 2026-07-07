import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Layers, Users, Calendar, TrendingUp,
  Edit2, Trash2, Download, ChevronLeft, ChevronRight, SlidersHorizontal
} from "lucide-react";
import AppLayout from "@/app/layouts/AppLayout";
import DeleteDialog from "@/shared/components/DeleteDialog";
import batchService from "../services/batchService";

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

export default function BatchDashboard() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const ROWS_PER_PAGE = 8;

  const fetchBatches = useCallback(() => {
    batchService.getBatches().then(data => setBatches(data || [])).catch(() => setBatches([]));
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const uniqueCourses = useMemo(() => {
    const set = new Set(batches.map(b => b.course).filter(Boolean));
    return Array.from(set);
  }, [batches]);

  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      const matchSearch = b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" || b.status === statusFilter;
      const matchCourse = courseFilter === "All" || b.course === courseFilter;
      return matchSearch && matchStatus && matchCourse;
    });
  }, [batches, searchTerm, statusFilter, courseFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / ROWS_PER_PAGE));
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await batchService.deleteBatch(deleteTarget.id);
      setDeleteTarget(null);
      fetchBatches();
    }
  };

  // Stats
  const stats = useMemo(() => ({
    active: batches.filter(b => b.status === "Active").length,
    totalStudents: batches.reduce((s, b) => s + (b.enrolled || 0), 0),
    upcoming: batches.filter(b => b.status === "Upcoming").length,
  }), [batches]);

  const statusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Upcoming") return "bg-orange-100 text-orange-700";
    if (status === "Completed") return "bg-slate-100 text-slate-500";
    return "bg-slate-100 text-slate-500";
  };

  return (
    <AppLayout>
      <div className="space-y-6" style={{ fontFamily: "'Geist', sans-serif" }}>

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Batch Management</h1>
            <p className="text-slate-400 text-xs mt-2">Manage cohorts, enrollment, and student allocations.</p>
          </div>
          <Button
            onClick={() => navigate("/trainer/batches/create")}
            className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-all h-9"
          >
            <Plus size={15} />
            <span>Create Batch</span>
          </Button>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-start w-full">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Batches</p>
                <h3 className="text-3xl font-black text-slate-800">{stats.active}</h3>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <TrendingUp size={11} />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#6C1D5F]/10 rounded-lg flex items-center justify-center text-[#6C1D5F] shrink-0">
                <Layers size={18} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-start w-full">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Students</p>
                <h3 className="text-3xl font-black text-slate-800">{stats.totalStudents.toLocaleString()}</h3>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <TrendingUp size={11} />
                  <span>+5% growth</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                <Users size={18} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-start w-full">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Upcoming Cohorts</p>
                <h3 className="text-3xl font-black text-slate-800">{stats.upcoming}</h3>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600 font-bold">
                  <Calendar size={11} />
                  <span>Starting in 14 days</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                <Calendar size={18} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">

          {/* Filters */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1 max-w-sm group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C1D5F] transition-colors z-10" />
                <Input
                  type="text"
                  placeholder="Search batch name or course..."
                  className="w-full pl-9 pr-4 bg-slate-50 border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-slate-200 transition-all text-slate-700 font-semibold h-8"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={val => { setStatusFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="bg-slate-50 border-none text-xs font-bold rounded-lg h-8 text-slate-650 w-[120px]">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Status: All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>

              <Select value={courseFilter} onValueChange={val => { setCourseFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="bg-slate-50 border-none text-xs font-bold rounded-lg h-8 text-slate-650 max-w-[200px]">
                  <SelectValue placeholder="Course: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Course: All</SelectItem>
                  {uniqueCourses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-1.5 px-3 text-xs font-bold text-slate-500 rounded-lg h-8 cursor-pointer">
                <SlidersHorizontal size={13} />
                <span>More Filters</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1.5 px-3 text-xs font-bold text-slate-500 rounded-lg h-8 cursor-pointer">
                <Download size={13} />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-100">
                  <TableHead className="px-6 py-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Batch Name</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Course Name</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Enrollment</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Date Range</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10">Status</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs font-bold">
                      No batches found matching the current filters.
                    </TableCell>
                  </TableRow>
                ) : paginatedBatches.map(batch => {
                  const pct = batch.capacity ? Math.round((batch.enrolled / batch.capacity) * 100) : 0;
                  return (
                    <TableRow key={batch.id} className="hover:bg-slate-50/40 transition-colors group border-b border-slate-100">
                      <TableCell className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{batch.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">ID: {batch.id}</p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-slate-500">{batch.course}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#6C1D5F] h-full rounded-full transition-all"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">
                            {batch.enrolled || 0}/{batch.capacity || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs text-slate-500">
                        {batch.startDate && batch.endDate
                          ? `${batch.startDate} - ${batch.endDate}`
                          : "—"}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColor(batch.status)}`}>
                          {batch.status || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => navigate(`/trainer/batches/edit/${batch.id}`)}
                            className="p-1.5 text-slate-400 hover:text-[#6C1D5F] rounded cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeleteTarget(batch)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              Showing {filteredBatches.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filteredBatches.length)} of {filteredBatches.length} batches
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronLeft size={15} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 text-[11px] font-bold rounded transition-all ${
                    currentPage === page
                      ? "bg-[#6C1D5F] text-white hover:bg-[#6C1D5F]/90"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  size="xs"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        </div>

      </div>

      <DeleteDialog
        isOpen={!!deleteTarget}
        title="Delete Batch"
        itemName={deleteTarget?.name}
        description="Are you sure you want to permanently delete this batch? This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
}
