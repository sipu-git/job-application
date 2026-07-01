"use client";

import axios from "axios";
import { ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/admin/admin-login",
                formData
            );

            toast.success(response.data.message || "Admin Login successful!");
            localStorage.setItem("adminAuth", "true")
            setFormData({
                email: "",
                password: ""
            });

            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 1500);
        } catch (error: any) {
            console.error(error?.response?.data?.message || "Admin login failed!");
            toast.error(error?.response?.data?.message || "Admin login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="w-14 h-14 bg-[#d4d4d4] rounded-full flex justify-center items-center">
                        <ShieldCheck size={40} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Admin Credentials</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter valid email"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            className="w-full"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter valid password"
                            disabled={loading}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Submit"}
                    </Button>
                </form>
            </div>
        </section>
    );
}
