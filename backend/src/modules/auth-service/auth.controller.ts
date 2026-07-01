import { Request, Response } from "express";
import { registerUser, signinUser } from "./auth.service";
import { registerSchema } from "./auth.valdiation";

export const createAccount = async (req: Request, res: Response) => {
    try {
        const parsed = await registerSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.message })
        }
        const response = await registerUser({ ...req.body });
        return res.status(201).json({ message: 'User account created successfully!', data: response })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, passwordHash } = req.body;
        const { findUser, token } = await signinUser({ email, passwordHash })
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",         // set false in local dev if no HTTPS
            sameSite: "lax",
        });
        return res.status(201).json({ message: "User siginin successfully!", findUser, token })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
