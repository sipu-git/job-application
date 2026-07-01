export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  salary: string;
  status: "Active" | "Closed" | "Draft";
  postedDate: string;
  applications: number;
  deadline: string;
}

export interface Application {
  id: string;
  applicantName: string;
  email: string;
  jobTitle: string;
  appliedDate: string;
  status: "New" | "Reviewed" | "Shortlisted" | "Rejected" | "Hired";
  experience: string;
  qualification: string;
}

export const jobs: Job[] = [
  {
    id: "JOB-001",
    title: "Senior Software Engineer",
    department: "Information Technology",
    location: "Washington, D.C.",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    status: "Active",
    postedDate: "2024-01-15",
    applications: 45,
    deadline: "2024-02-15"
  },
  {
    id: "JOB-002",
    title: "Policy Analyst",
    department: "Policy & Planning",
    location: "New York, NY",
    type: "Full-time",
    salary: "$85,000 - $105,000",
    status: "Active",
    postedDate: "2024-01-18",
    applications: 32,
    deadline: "2024-02-20"
  },
  {
    id: "JOB-003",
    title: "Administrative Assistant",
    department: "Administration",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$45,000 - $55,000",
    status: "Active",
    postedDate: "2024-01-20",
    applications: 78,
    deadline: "2024-02-25"
  },
  {
    id: "JOB-004",
    title: "Data Scientist",
    department: "Research & Analytics",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    status: "Active",
    postedDate: "2024-01-22",
    applications: 56,
    deadline: "2024-02-28"
  },
  {
    id: "JOB-005",
    title: "Legal Counsel",
    department: "Legal Affairs",
    location: "Washington, D.C.",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    status: "Closed",
    postedDate: "2023-12-01",
    applications: 23,
    deadline: "2024-01-01"
  },
  {
    id: "JOB-006",
    title: "HR Coordinator",
    department: "Human Resources",
    location: "Boston, MA",
    type: "Part-time",
    salary: "$35,000 - $45,000",
    status: "Draft",
    postedDate: "2024-01-25",
    applications: 0,
    deadline: "2024-03-01"
  }
];

export const applications: Application[] = [
  {
    id: "APP-001",
    applicantName: "John Smith",
    email: "john.smith@email.com",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-01-20",
    status: "New",
    experience: "8 years",
    qualification: "Master's in Computer Science"
  },
  {
    id: "APP-002",
    applicantName: "Sarah Johnson",
    email: "sarah.j@email.com",
    jobTitle: "Policy Analyst",
    appliedDate: "2024-01-21",
    status: "Reviewed",
    experience: "5 years",
    qualification: "Master's in Public Policy"
  },
  {
    id: "APP-003",
    applicantName: "Michael Chen",
    email: "m.chen@email.com",
    jobTitle: "Data Scientist",
    appliedDate: "2024-01-22",
    status: "Shortlisted",
    experience: "6 years",
    qualification: "PhD in Statistics"
  },
  {
    id: "APP-004",
    applicantName: "Emily Davis",
    email: "emily.d@email.com",
    jobTitle: "Administrative Assistant",
    appliedDate: "2024-01-23",
    status: "New",
    experience: "3 years",
    qualification: "Bachelor's in Business Admin"
  },
  {
    id: "APP-005",
    applicantName: "Robert Wilson",
    email: "r.wilson@email.com",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-01-24",
    status: "Rejected",
    experience: "4 years",
    qualification: "Bachelor's in Computer Science"
  },
  {
    id: "APP-006",
    applicantName: "Lisa Anderson",
    email: "lisa.a@email.com",
    jobTitle: "Legal Counsel",
    appliedDate: "2024-01-19",
    status: "Hired",
    experience: "12 years",
    qualification: "Juris Doctor (JD)"
  },
  {
    id: "APP-007",
    applicantName: "David Martinez",
    email: "d.martinez@email.com",
    jobTitle: "Policy Analyst",
    appliedDate: "2024-01-25",
    status: "New",
    experience: "7 years",
    qualification: "Master's in Economics"
  },
  {
    id: "APP-008",
    applicantName: "Jennifer Brown",
    email: "j.brown@email.com",
    jobTitle: "Data Scientist",
    appliedDate: "2024-01-26",
    status: "Reviewed",
    experience: "4 years",
    qualification: "Master's in Data Science"
  }
];

export const dashboardStats = {
  totalJobs: 6,
  activeJobs: 4,
  totalApplications: 234,
  newApplications: 45,
  shortlisted: 28,
  hired: 12
};
