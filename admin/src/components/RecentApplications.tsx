import { useEffect } from "react";
import { UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAts } from "../context/AtsContext";
type ApplicartionStatus = "submitted" | "Reviewing" | "Shortlisted" | "rejected";

const statusConfig: Record<ApplicartionStatus, { label: string; className?: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  submitted: { label: "submitted", variant: "secondary", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  Reviewing: { label: "Reviewing", variant: "outline", className: "bg-blue-100 text-blue-700 border-blue-200" },
  Shortlisted: { label: "Shortlisted", variant: "default", className: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Rejected", variant: "destructive", className: "bg-red-100 text-red-700 border-red-200" },
};

export function RecentApplications() {
  const { viewRecentApplications, recentApplications, loading } = useAts()
  useEffect(() => {
    viewRecentApplications();
  }, [])

  {
    loading && (
      <tr>
        <td
          colSpan={7}
          className="px-4 py-6 text-center text-muted-foreground"
        >
          Loading jobs...
        </td>
      </tr>
    )
  }

  {
    !loading && recentApplications.length === 0 && (
      <tr>
        <td
          colSpan={7}
          className="px-4 py-6 text-center text-muted-foreground"
        >
          No active jobs found
        </td>
      </tr>
    )
  }
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {recentApplications.map((app) => (
            <div key={app._id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {app.applicantName ? app.applicantName.split(" ").map((n: string) => n[0]).join("") : <UserRound />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{app.applicantName}</p>
                <p className="text-sm text-muted-foreground truncate">{app.jobId?.title}</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-muted-foreground">{app.jobId?.department}</p>
                <p className="text-xs text-muted-foreground">{app.appliedDate
                  ? new Date(app.appliedDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })
                  : "N/A"}</p>
              </div>
              {(() => {
                const status = app.status as ApplicartionStatus;

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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
