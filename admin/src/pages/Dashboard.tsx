import { 
  Briefcase, 
  FileText, 
  UserCheck, 
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import { useEffect } from "react";
import { useAts } from "../context/AtsContext";
import { useNavigate } from "react-router-dom";
import { ActiveJobsTable } from "../components/ActiveJobsTable";
import { RecentApplications } from "../components/RecentApplications";
import { Button } from "../components/ui/button";
import { StatCard } from "@/components/StatCard";
import { dashboardStats } from "@/lib/mockData";

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "New":
      return "status-badge bg-blue-100 text-blue-800";
    case "Reviewed":
      return "status-badge status-reviewed";
    case "Shortlisted":
      return "status-badge bg-purple-100 text-purple-800";
    case "Hired":
      return "status-badge status-active";
    case "Rejected":
      return "status-badge status-closed";
    default:
      return "status-badge";
  }
};

export default function Dashboard() {
  const {jobsLength,applicationsLength,getJobs,getApplications} = useAts()
  useEffect(()=>{
    getJobs()
    getApplications()
  },[])
  const navigate = useNavigate()
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-description">
          Welcome back! Here's what's happening with your job portal today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Job Posts"
          value={jobsLength}
          change="+2 from last month"
          changeType="positive"
          icon={Briefcase}
        />
        <StatCard
          title="Total Applications"
          value={applicationsLength}
          change="+18% from last week"
          changeType="positive"
          icon={FileText}
        />
        <StatCard
          title="New Applications"
          value={dashboardStats.newApplications}
          change="Awaiting review"
          changeType="neutral"
          icon={Clock}
        />
        <StatCard
          title="Candidates Hired"
          value={dashboardStats.hired}
          change="+3 this month"
          changeType="positive"
          icon={UserCheck}
        />
      </div>

      {/* Two Column Layout */}
     <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveJobsTable />
        </div>
        <div>
          <RecentApplications />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate("/add-job")}
          >
            <Briefcase className="h-5 w-5" />
            <span>Post New Job</span>
          </Button>
          <Button 
            variant="secondary"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate("/applications")}
          >
            <FileText className="h-5 w-5" />
            <span>Review Applications</span>
          </Button>
          <Button 
            variant="secondary"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate("/jobs")}
          >
            <TrendingUp className="h-5 w-5" />
            <span>View Analytics</span>
          </Button>
          <Button 
            variant="secondary"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <Users className="h-5 w-5" />
            <span>Manage Team</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
