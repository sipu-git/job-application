"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { useAts } from "../context/AtsContext";

type JobFormState = {
  title: string;
  requiredSkills: string;
  experiences: string;
  department: string;
  description: string;
  responsibilities: string;
  empType: string;
  requirements: string;
  education: string;
  company: string;
  location: string;
  salary: string;
  vacancies: number;
  tags: string;
  deadline?: Date;
};

const toString = (arr?: string[]) =>
  Array.isArray(arr) ? arr.join(", ") : "";

const toArray = (value: string) =>
  value.split(",").map((v) => v.trim()).filter(Boolean);

export default function UpdateJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { job, getJobById, updateJob, loading } = useAts();

  const [formData, setFormData] = useState<JobFormState>({
    title: "",
    requiredSkills: "",
    experiences: "",
    department: "",
    description: "",
    responsibilities: "",
    empType: "",
    requirements: "",
    education: "",
    company: "",
    location: "",
    salary: "",
    vacancies: 1,
    tags: "",
    deadline: undefined,
  });

  useEffect(() => {
    if (id) {
      getJobById(id);
    }
  }, [id]);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        requiredSkills: toString(job.requiredSkills),
        experiences: job.experiences || "",
        department: job.department || "",
        description: job.description || "",
        responsibilities: toString(job.responsibilities),
        empType: job.empType || "",
        requirements: toString(job.requirements),
        education: toString(job.education),
        company: job.company || "",
        location: job.location || "",
        salary: job.salary || "",
        vacancies: job.vacancies || 1,
        tags: toString(job.tags),
        deadline: job.deadline ? new Date(job.deadline) : undefined,
      });
    }
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: id === "vacancies" ? Number(value) : value
    }));
  };

  const handleSelect = (key: keyof JobFormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      title: formData.title,
      requiredSkills: toArray(formData.requiredSkills),
      experiences: formData.experiences || undefined,
      department: formData.department || undefined,
      description: formData.description,
      responsibilities: toArray(formData.responsibilities),
      empType: formData.empType,
      requirements: toArray(formData.requirements),
      education: toArray(formData.education),
      company: formData.company || undefined,
      location: formData.location,
      salary: formData.salary || undefined,
      vacancies: formData.vacancies,
      tags: toArray(formData.tags),
      deadline: formData.deadline
        ? formData.deadline.toISOString() : undefined,
    };

    const success = await updateJob(id, payload);
    if (success) {
      navigate(`/job/${id}`);
    }
  };

  if (loading && !job) {
    return (
        <div className="text-center py-10 text-muted-foreground">
          Loading job details...
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* MAIN FORM */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the main details for this job posting
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(v) =>
                        handleSelect("department", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT Department">
                          IT Department
                        </SelectItem>
                        <SelectItem value="HR Resource">
                          Human Resources
                        </SelectItem>
                        <SelectItem value="Finance">
                          Finance
                        </SelectItem>
                        <SelectItem value="Administration">
                          Administration
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(v) =>
                        handleSelect("location", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                        <SelectItem value="Noida">Noida</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Employment Type *</Label>
                    <Select
                      value={formData.empType}
                      onValueChange={(v) =>
                        handleSelect("empType", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Time">
                          Full Time
                        </SelectItem>
                        <SelectItem value="Contractual">
                          Contractual
                        </SelectItem>
                        <SelectItem value="Part Time">
                          Part Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experiences">
                      Experience
                    </Label>
                    <Input
                      id="experiences"
                      value={formData.experiences}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LIST FIELDS */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Use commas to separate multiple values
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Label>Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                />

                <Label>Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                />

                <Label>Required Skills</Label>
                <Textarea
                  id="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                />

                <Label>Education</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={handleChange}
                />

                <Label>Tags</Label>
                <Textarea
                  id="tags"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>
                  Deadline & Vacancies
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Label>Application Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deadline
                        ? format(
                          formData.deadline,
                          "PPP"
                        )
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(d) =>
                        setFormData((prev) => ({
                          ...prev,
                          deadline: d || undefined,
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Label htmlFor="vacancies">
                  Vacancies
                </Label>
                <Input
                  id="vacancies"
                  type="number"
                  min="1"
                  value={formData.vacancies}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  type="submit"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
