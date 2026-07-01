import { useEffect, useState } from "react";
import { jobs, Job } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, MoreVertical, Edit, Trash2, Eye, Copy, PlusCircle, Building2, MapPin, Wallet, Calendar, Users, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAts } from "@/context/AtsContext";
import { Card, CardContent } from "@/components/ui/card";

const statusConfig: Record<
  "Active" | "Expiring Soon" | "DeActivate" | "Expired",
  { label: string; className: string }
> = {
  Active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  "Expiring Soon": {
    label: "Expiring Soon",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  DeActivate: {
    label: "Deactivated",
    className: "bg-muted text-muted-foreground border-muted",
  },
  Expired: {
    label: "Expired",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};


export default function Jobs() {
  const navigate = useNavigate();
  const { jobs, loading, getJobs, deleteJob } = useAts()

  useEffect(() => {
    getJobs()
  }, [])

{
    loading && (
      <tr>
        <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
          Loading jobs...
        </td>
      </tr>
    )
  }

  {
    !loading && jobs.length === 0 && (
      <tr>
        <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
          No job records found
        </td>
      </tr>
    )
  }
   const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to remove this application?");
    if (!confirmed) return;

    await deleteJob(id);
  };
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Current Job Listings</h1>
          <p className="page-description">
            Manage all active, closed, and draft job postings.
          </p>
        </div>
        <Button onClick={() => navigate("/add-job")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Job
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-status-success-bg border border-status-success/20 rounded-lg p-4">
          <p className="text-sm font-medium text-status-success-text">Active Jobs</p>
          <p className="text-2xl font-bold text-foreground">
            {jobs.filter(j => j.status === "Active").length}
          </p>
        </div>
        <div className="bg-status-warning-bg border border-status-warning/20 rounded-lg p-4">
          <p className="text-sm font-medium text-status-warning-text">Draft Jobs</p>
          <p className="text-2xl font-bold text-foreground">
            {jobs.filter(j => j.status === "Expiring Soon").length}
          </p>
        </div>
        <div className="bg-status-neutral-bg border border-status-neutral/20 rounded-lg p-4">
          <p className="text-sm font-medium text-status-neutral-text">Closed Jobs</p>
          <p className="text-2xl font-bold text-foreground">
            {jobs.filter(j => j.status === "Expired").length}
          </p>
        </div>
      </div>

      {/* Filters */}
     <Card className="border-border/60 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-4 flex-col sm:flex-row">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search jobs..." className="pl-9" />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="it">IT Department</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="policy">Policy Division</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closing">Closing Soon</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link to="/add-job">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add New Job
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job._id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {job.title}
                </h3>
                <Badge variant="outline" className={statusConfig[job.status].className}>
                  {statusConfig[job.status].label}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span>{job.salary || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {job.deadline
                    ? new Date(job.deadline).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })
                    : "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{job.applications} applications</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                   <Link to={`/edit-job/${job._id}`}> <Edit className="h-4 w-4" /></Link>
                  </Button>
                  <Button onClick={() => handleDelete(job._id)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
