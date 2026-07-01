import { useEffect, useState } from "react";
import { applications, Application } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, CheckCircle, XCircle, Mail, Download, UserRound, MoreHorizontal, FileText, Phone, X } from "lucide-react";
import { useAts } from "@/context/AtsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const statusConfig: Record<"submitted" | "Reviewing" | "Shortlisted" | "rejected", { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  submitted: { label: "submitted", variant: "secondary" },
  Reviewing: { label: "Reviewing", variant: "outline" },
  Shortlisted: { label: "Shortlisted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export default function Applications() {
  const { getApplications, applications, deleteApplication, loading } = useAts()

  useEffect(() => {
    getApplications()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to remove this application?");
    if (!confirmed) return;

    await deleteApplication(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">View Applications</h1>
        <p className="page-description">
          Review and manage all job applications submitted by candidates.
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border/60 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-4 flex-col sm:flex-row">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name or email..." className="pl-9" />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="software">Software Engineer</SelectItem>
                  <SelectItem value="policy">Policy Analyst</SelectItem>
                  <SelectItem value="admin">Administrative Officer</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Under Review</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Applicants
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    ATS Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Applied Date
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
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      Loading applications...
                    </td>
                  </tr>
                )}

                {!loading && applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      No applications found
                    </td>
                  </tr>
                )}

                {!loading &&
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {app.applicantName
                                ? app.applicantName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                : <UserRound />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {app.applicantName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {app.applicantEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">
                          {app.jobId?.title || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {app.jobId?.department || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground">{app.score}</p>
                      </td>

                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {app.appliedDate
                          ? new Date(app.appliedDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={statusConfig[app.status].variant}>
                          {statusConfig[app.status].label}
                        </Badge>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="bg-popover border border-border">
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                <Link to={`/view-application/${app._id}`}>View Details</Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>

                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Schedule Call
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="cursor-pointer text-destructive"
                                onClick={() => handleDelete(app._id)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Delete Application
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
