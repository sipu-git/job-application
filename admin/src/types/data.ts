export interface JobData {
    _id: string;
    title: string;
    requiredSkills: string[];
    experiences?: string;
    department?: string;
    description: string;
    responsibilities?: string[];
    requirements?: string[];
    empType: string;
    education?: string[];
    company?: string;
    location: string;
    salary?: string;
    deadline?: string;
    applications?: number;
    totalApplications?: ApplicationData[];
    vacancies?: number;
    status: 'Active' | 'Expiring Soon' | 'Expired';
    autoClosed: boolean;
    createdAt?: string;
    closedReason?: string;
    tags?: string[];
}

export interface ApplicationData {
  _id: string;
  documentId?: string;

  jobId?: {
    _id: string;
    title: string;
    department?: string;
    company?: string;
    location?: string;
    empType?: string;
    salary?: string;
    deadline?: string;
    vacancies?: number;
    status?: string;
  };

  resumeData: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    education?: {
      schoolOrCollege: string;
      course: string;
      startYear?: string;
      endYear?: string;
    }[];
    experience?: {
      company: string;
      designation: string;
      startDate?: string;
      endDate?: string;
    }[];
  };

  applicantName: string;
  applicantEmail: string;
  score: number;
  status: "submitted" | "Reviewing" | "Shortlisted" | "rejected";
  appliedDate: string;
}
