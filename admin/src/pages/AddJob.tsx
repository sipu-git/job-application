import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CalendarIcon, Save, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "date-fns";

type JobFormState = {
  title: string;
  requiredSkills: string;
  experiences?: string;
  department: string;
  description: string;
  responsibilities: string;
  empType: string;
  requirements?: string;
  education: string;
  company: string;
  location: string;
  salary: string;
  vacancies: number;
  tags: string;
};
const toArray = (value?: string) => value?.split(",").map(v => v.trim()).filter(Boolean);
export default function AddJob() {
  const [deadline, setDeadline] = useState<Date>();
  const { toast } = useToast();
  const [formData, setFormData] = useState<JobFormState>({
    title: "",
    requiredSkills: "",
    experiences: "",
    department: "",
    requirements: "",
    description: "",
    responsibilities: "",
    empType: "",
    education: "",
    company: "",
    location: "",
    salary: "",
    vacancies: 1,
    tags: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev, [id]: id === "vacancies" ? Number(value) : value
    }))
  }
  const handleSelect = (key: keyof JobFormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        experiences: formData.experiences || undefined,
        department: formData.department || undefined,
        description: formData.description,
        requiredSkills: toArray(formData.requiredSkills),
        responsibilities: toArray(formData.responsibilities),
        requirements: toArray(formData.requirements),
        education: toArray(formData.education),
        tags: toArray(formData.tags), empType: formData.empType,
        company: formData.company || undefined,
        location: formData.location,
        salary: formData.salary || undefined,
        deadline,
        vacancies: formData.vacancies || undefined,
      };

      const response = await axios.post("http://localhost:5000/api/career/add-job", payload,
        { withCredentials: true }
      );
      toast({
        title: "Job Creation",
        description: response.data.message || "Your job posting has been published successfully."
      });

      setFormData({
        title: "",
        requiredSkills: "",
        experiences: "",
        department: "",
        description: "",
        responsibilities: "",
        requirements: "",
        empType: "",
        education: "",
        company: "",
        location: "",
        salary: "",
        vacancies: 1,
        tags: ""
      });
      setDeadline(undefined);
    } catch (error: any) {
      console.error(error?.response?.data?.message || "Something went wrong. Try again.");
      toast({
        title: "Failed to create job",
        description: error?.response?.data?.message || "Something went wrong. Try again.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="page-title">Add New Job Post</h1>
          <p className="page-description">
            Create a new job listing to attract qualified candidates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
                <CardDescription>
                  Enter the primary details for this job posting.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select onValueChange={v => handleSelect("department", v)}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT Department">IT Department</SelectItem>
                        <SelectItem value="HR Resource">Human Resources</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select onValueChange={v => handleSelect("location", v)}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">New Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Gujurat">Gujurat</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                        <SelectItem value="Noida">Noida</SelectItem>
                        <SelectItem value="Bhubaneswar">Bhubaneswar</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="empType">Employment Type *</Label>
                    <Select onValueChange={v => handleSelect("empType", v)}>
                      <SelectTrigger id="empType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Time">Permanent</SelectItem>
                        <SelectItem value="Contractual">Contract</SelectItem>
                        <SelectItem value="Part Time">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="4 LPA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g., TCS, Wipro, Infosys"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experiences">Experience</Label>
                    <Input
                      id="experiences"
                      value={formData.experiences}
                      onChange={handleChange}
                      placeholder="2 Years"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lists Section */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Job Details</CardTitle>
                <CardDescription>
                  Use commas to separate multiple values (e.g. Node.js, MongoDB, AWS)
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Key Responsibilities *</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    placeholder="Build REST APIs, Maintain DB, Collaborate with frontend"
                    className="min-h-[90px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Job Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Node.js, MongoDB, AWS"
                    className="min-h-[90px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredSkills">Required Skills *</Label>
                  <Textarea
                    id="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    placeholder="React, TypeScript, Express"
                    className="min-h-[90px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="About role"
                    className="min-h-[90px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="B.Tech in CS, MCA"
                    className="min-h-[90px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Textarea
                    id="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Remote, Urgent, Startup"
                    className="min-h-[70px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Publishing</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Application Deadline *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? formatDate(deadline, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vacancies">Number of Vacancies</Label>
                  <Input
                    id="vacancies"
                    type="number"
                    min="1"
                    value={formData.vacancies}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Publish Job Post
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
