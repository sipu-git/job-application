"use client";

import { Eye, Edit, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAts } from "../context/AtsContext";
type JobStatus = "Active" | "Expiring Soon" | "Expired";

const statusConfig: Record<JobStatus,
  { label: string; className: string }
> = {
  Active: {
    label: "Active",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  "Expiring Soon": {
    label: "Expiring Soon",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  Expired: {
    label: "Expired",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export function ActiveJobsTable() {
  const { viewRecentJobs, loading, recentJobs } = useAts()
  useEffect(() => {
    viewRecentJobs()
  }, [])
  if (loading) {
      <div className="text-center py-10 text-muted-foreground">
        Loading job details...
      </div>
  }
  if (!loading && recentJobs.length === 0) {
    return (
        <div className="text-center py-10 text-muted-foreground">
          Recent jobs are not available...
        </div>
    )
  }
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Active Job Posts
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary/30 hover:bg-primary/5"
          >
            <Link to="/jobs">View All</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Applications
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Deadline
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {/* LOADING STATE */}
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Loading jobs...
                  </td>
                </tr>
              )}

              {/* DATA ROWS */}
              {!loading &&
                recentJobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {job.title}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {job.department}
                    </td>

                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {job.location}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                        {job.applications || 0}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })
                        : "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      {(() => {
                        const status = job.status as JobStatus;

                        return (
                          <Badge
                            variant="outline"
                            className={
                              statusConfig[status]?.className ||
                              "bg-muted text-muted-foreground"
                            }
                          >
                            {statusConfig[status]?.label || "Unknown"}
                          </Badge>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="bg-popover border border-border"
                        >
                          <DropdownMenuItem asChild>
                            <Link to={`/job/${job._id}`} className="flex cursor-pointer items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <div className="flex cursor-pointer items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <Link to={`/edit-job/${job._id}`}>Edit Post</Link>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
