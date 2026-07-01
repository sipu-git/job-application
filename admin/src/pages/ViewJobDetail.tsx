import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { useAts } from "../context/AtsContext";
import {
    MapPin,
    Building2,
    Wallet,
    Users,
    Briefcase,
    ArrowLeft,
    FileText,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Badge } from "../components/ui/badge";

const statusConfig: Record<
    "Active" | "Expiring Soon" | "Expired",
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
    Expired: {
        label: "Expired",
        className: "bg-destructive/10 text-destructive border-destructive/20",
    },
};
const renderLIstItems = (value?: string | string[]) => {
    if (!value) {
        return (
            <span className="">
                No data available.
            </span>
        )
    }
    let items: string[] = [];

    if (Array.isArray(value)) {
        items = value.map(item => item.trim()).filter(Boolean);
    } else if (typeof value === "string") {
        items = value.split(".").map(item => item.trim()).filter(Boolean);
    }

    return (
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
};

export default function ViewJobDetail() {
    const { id } = useParams();
    const { job, getJobById, loading } = useAts();

    useEffect(() => {
        if (id) { getJobById(id) };
    }, [id]);

    function formatDate(dateStr?: string) {
        if(!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    if (loading || !job) {
        return (
                <div className="text-center py-10 text-muted-foreground">
                    Loading job details...
                </div>
        );
    }


    return (
        <div className="w-full">
            {/* Back Button */}
            <div className="inline-flex my-3">
                <Link to="/">
                    <Button
                        variant="ghost"
                        className="inline-flex items-center gap-2 w-auto px-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Jobs
                    </Button>
                </Link>
            </div>

            {/* Top Summary Card */}
            <Card className="border-border/60 shadow-sm mb-6">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-xl mb-1">
                            {job.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {job.department}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                            </div>
                        </div>
                    </div>

                    <Badge
                        variant="outline"
                        className={statusConfig[job.status].className}
                    >
                        {statusConfig[job.status].label}
                    </Badge>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="font-medium">Employment:</span>
                        <span>{job.empType || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span className="font-medium">Salary:</span>
                        <span>{job.salary || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Deadline:</span>
                        <span>
                            {job.deadline
                                ? new Date(job.deadline).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                                : "N/A"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">Applications:</span>
                        <span>{job.applications || 0}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Main Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Description */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground leading-relaxed">
                            {job.description || "No description provided."}
                        </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Required Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {job.requiredSkills?.length > 0 ? (
                                job.requiredSkills.map((skill, i) => (
                                    <Badge key={i} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    No skills specified.
                                </span>
                            )}
                        </CardContent>
                    </Card>
                    {/* Responsibilities */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Responsibilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderLIstItems(job.responsibilities)}
                        </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Requirements:</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderLIstItems(job.requirements)}
                        </CardContent>
                    </Card>
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Educations:</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderLIstItems(job.education)}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Job Info */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Job Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Company</span>
                                <span className="font-medium">
                                    {job.company || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Location</span>
                                <span className="font-medium">
                                    {job.location || "N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Experience</span>
                                <span className="font-medium">
                                    {job.experiences || "N/A"} years
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Vacancies</span>
                                <span className="font-medium">
                                    {job.vacancies || "N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Posted On</span>
                                <span className="font-medium">
                                    {formatDate(job.createdAt)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Applications */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Applications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {job.totalApplications && job.totalApplications.length ? (
                                job.totalApplications?.map((app, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                {app.applicantName
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {app.applicantName}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {app.applicantEmail}
                                                </div>
                                            </div>
                                        </div>

                                        <Badge variant="outline">
                                            {app.status || "Pending"}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    No applications yet.
                                </div>
                            )}

                            <Link to={`/view-related-application/${job._id}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-3"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View All Applications
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
