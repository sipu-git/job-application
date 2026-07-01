import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAts } from "../context/AtsContext";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "../components/ui/badge";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 py-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function ViewApplication() {
  const { getApplicationById, application, loading } = useAts();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      getApplicationById(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Application not found
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen p-6">
      <Card className="w-full max-w-7xl">
        {/* Parent Header */}
        <CardHeader>
          <CardTitle className="flex items-center gap-2"> <Link to="/applications"><ChevronLeft className="text-xl text-[#828284]" /></Link> <span className="">Application Overview</span></CardTitle>
        </CardHeader>

        <CardContent className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Applicant Info */}
            <Section title="Applicant Information">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {application.applicantName
                      ? application.applicantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : <UserRound />}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-lg font-semibold">
                    {application.applicantName || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {application.applicantEmail || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {application.resumeData?.phone || "N/A"}
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Education">
              {application.resumeData?.education?.length ? (
                application.resumeData.education.map((edu, i) => (
                  <div key={i} className="text-sm text-muted-foreground mt-2">
                    <p className="font-medium text-foreground">
                      {edu.course}
                    </p>
                    <p>{edu.schoolOrCollege}</p>
                    <p>
                      {edu.startYear} - {edu.endYear || "Present"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">N/A</p>
              )}
            </Section>
          </div>

          <div className="space-y-6">
            <Section title="ATS Score">
              <p className="text-2xl font-bold mb-4">
                {application.score || 0}
              </p>

              <div className="flex flex-wrap gap-2">
                {application.resumeData?.skills?.length ? (
                  application.resumeData.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No skills specified.
                  </span>
                )}
              </div>
            </Section>

            <Section title="Experience">
              {application.resumeData?.experience?.length ? (
                application.resumeData.experience.map((exp, i) => (
                  <div key={i} className="text-sm text-muted-foreground mt-2">
                    <p className="font-medium text-foreground">
                      {exp.designation}
                    </p>
                    <p>{exp.company}</p>
                    <p>
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">N/A</p>
              )}
            </Section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
