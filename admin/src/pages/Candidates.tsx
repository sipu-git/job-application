import {
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Star
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+91 98765 43210",
    location: "New Delhi",
    experience: "8 years",
    education: "M.Tech Computer Science, IIT Delhi",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    appliedJobs: 2,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+91 98765 43211",
    location: "Mumbai",
    experience: "5 years",
    education: "MA Public Policy, TISS",
    skills: ["Policy Analysis", "Research", "Report Writing"],
    appliedJobs: 1,
    rating: 4.2,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+91 98765 43212",
    location: "Bangalore",
    experience: "6 years",
    education: "MBA Human Resources, IIM Ahmedabad",
    skills: ["HR Management", "Recruitment", "Training"],
    appliedJobs: 3,
    rating: 4.8,
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+91 98765 43213",
    location: "Hyderabad",
    experience: "4 years",
    education: "M.Sc Statistics, ISI Kolkata",
    skills: ["Statistical Analysis", "R", "SQL"],
    appliedJobs: 2,
    rating: 4.0,
  },
  {
    id: 5,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43214",
    location: "Chennai",
    experience: "7 years",
    education: "Ph.D Chemistry, IISc Bangalore",
    skills: ["Research", "Lab Management", "Publications"],
    appliedJobs: 1,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Robert Kumar",
    email: "robert.kumar@email.com",
    phone: "+91 98765 43215",
    location: "Kolkata",
    experience: "10 years",
    education: "B.Tech Computer Science, NIT Warangal",
    skills: ["System Architecture", "Cloud Computing", "DevOps"],
    appliedJobs: 4,
    rating: 4.9,
  },
];

export default function Candidates() {
  return (
    <DashboardLayout
    >
      {/* Search */}
      <Card className="border-border/60 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search candidates by name, skills..." className="pl-9" />
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {candidates.length} candidates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                    {candidate.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{candidate.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{candidate.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{candidate.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span className="truncate">{candidate.education}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <span className="text-sm text-muted-foreground">
                  Applied to {candidate.appliedJobs} job{candidate.appliedJobs > 1 ? "s" : ""}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
