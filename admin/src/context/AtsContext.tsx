import { createContext, useContext, useState, type ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type { ApplicationData, JobData } from "../types/data";

interface AtsContextType {
    jobs: JobData[];
    job: JobData | null;
    applications: ApplicationData[];
    application: ApplicationData | null;

    jobsLength: number;
    applicationsLength: number;
    message: string;
    loading: boolean;
    recentJobs: JobData[];
    jobApplications: ApplicationData[];
    recentApplications: ApplicationData[];
    viewRecentApplications: () => Promise<void>;
    viewJobApplications: (jobId: string) => Promise<void>;
    deleteApplication: (id: string) => Promise<boolean>;
    deleteJob: (id: string) => Promise<boolean>;
    viewRecentJobs: () => Promise<void>;
    getJobs: () => Promise<void>;
    getJobById: (id: string) => Promise<void>;
    getApplications: () => Promise<void>;
    getApplicationById: (id: string) => Promise<void>;
    updateJob: (id: string, data: Partial<JobData>) => Promise<boolean>;
}

const AtsContext = createContext<AtsContextType | null>(null);

const API_BASE_URL = "http://localhost:5000/api/career";

export function AtsProvider({ children }: { children: ReactNode }) {
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [job, setJob] = useState<JobData | null>(null);
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [application, setApplication] = useState<ApplicationData | null>(null);
    const [recentJobs, setRecentJobs] = useState<JobData[]>([])
    const [recentApplications, setRecentApplications] = useState<ApplicationData[]>([])
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [jobApplications, setJobApplications] = useState<ApplicationData[]>([])

    const jobsLength = jobs.length;
    const applicationsLength = applications.length;

    const handleError = (error: unknown, fallback: string) => {
        const err = error as AxiosError<any>;
        const msg =
            err?.response?.data?.message ||
            err?.message ||
            fallback;
        console.error(msg);
        setMessage(msg);
        toast.error(msg);
    };

    // Get All Jobs
    const getJobs = async () => {
        if (jobs.length > 0) return;
        try {
            setLoading(true);
            setMessage("");
            const res = await axios.get(`${API_BASE_URL}/get-jobs`);
            setJobs(res.data.data || []);
        } catch (error) {
            handleError(error, "Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };
    // Get Recent Jobs
    const viewRecentJobs = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axios.get(`${API_BASE_URL}/view-recent-job`);
            setRecentJobs(res.data.data || []);
        } catch (error) {
            handleError(error, "Failed to fetch recent jobs");
        } finally {
            setLoading(false);
        }
    };
    const viewJobApplications = async (jobId: string) => {
        try {
            setLoading(true);
            setMessage("");
            console.log("Calling API with jobId:", jobId);

            if (!jobId) {
                throw new Error("Job ID is required");
            }

            const response = await axios.get(
                `${API_BASE_URL}/view-existed-application`,
                { params: { jobId } }
            );
            setJobApplications(response.data.data || []);
        } catch (error: any) {
            console.error(
                error?.response?.data?.message || "Failed to fetch applications"
            );
            setMessage(
                error?.response?.data?.message || "Failed to fetch applications"
            );
        } finally {
            setLoading(false);
        }
    };

    // Get Recent Applications
    const viewRecentApplications = async () => {
        try {
            setLoading(true);
            setMessage("");
            const res = await axios.get(`${API_BASE_URL}/view-recent-application`);
            setRecentApplications(res.data.data || []);
        } catch (error) {
            handleError(error, "Failed to fetch recent applications");
        } finally {
            setLoading(false);
        }
    };

    const getJobById = async (id: string) => {
        try {
            setLoading(true);
            setJob(null)
            setMessage("");
            const res = await axios.get(`${API_BASE_URL}/get-job/${id}`);
            setJob(res.data.data || null);
        } catch (error) {
            handleError(error, "Failed to fetch job");
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id: string) => {
        try {
            setLoading(true);
            setMessage("");
            const res = await axios.delete(`${API_BASE_URL}/delete-application/${id}`);
            toast.success(res.data.message || "Application deleted");
            setApplications(prev => prev.filter(app => app._id !== id));
            setRecentApplications(prev => prev.filter(app => app._id !== id));
            setJobApplications(prev => prev.filter(app => app._id !== id));
            return true;
        } catch (error:any) {
            toast.error(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (id: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/delete-job/${id}`)
            toast.success(response.data.message || "Job deleted");
            setJobs(prev => prev.filter(app => app._id !== id));
            setJobs(prev => prev.filter(app => app._id !== id));
            return true;

        } catch (error:any) {
            toast.error(error);
            return false;
        }
        finally {
            setLoading(false)
        }
    }
    const getApplications = async () => {
        if (applications.length > 0) return;
        try {
            setLoading(true);
            setMessage("");
            const res = await axios.get(`${API_BASE_URL}/view-applications`);
            setApplications(res.data.data || []);
        } catch (error) {
            handleError(error, "Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const getApplicationById = async (id: string) => {
        try {
            setLoading(true);
            setMessage("");
            const res = await axios.get(`${API_BASE_URL}/view-application/${id}`
            );
            setApplication(res.data.data || null);
        } catch (error) {
            handleError(error, "Failed to fetch application");
        } finally {
            setLoading(false);
        }
    };

    const updateJob = async (id: string, data: Partial<JobData>): Promise<boolean> => {
        try {
            setLoading(true);
            setMessage("");
            const response = await axios.put(`${API_BASE_URL}/modify-job/${id}`, data);
            toast.success(response.data.message || "Job updated successfully");
            setJob(response.data.data);
            await getJobs();
            return true;
        } catch (error:any) {
            console.error(error);
            toast.error(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const value: AtsContextType = {
        jobs,
        job,
        applications,
        application,
        jobsLength,
        applicationsLength,
        message,
        loading,
        recentApplications,
        recentJobs,
        jobApplications,
        deleteApplication,
        deleteJob,
        viewRecentApplications,
        viewJobApplications,
        viewRecentJobs,
        getJobs,
        getJobById,
        getApplications,
        getApplicationById,
        updateJob,
    };

    return (
        <AtsContext.Provider value={value}>
            {children}
        </AtsContext.Provider>
    );
}

export function useAts() {
    const context = useContext(AtsContext);
    if (!context) {
        throw new Error("useAts must be used inside AtsProvider");
    }
    return context;
}
