import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { LoginInput, RegisterInput } from "./auth.valdiation";
import { prisma } from '../../shared/lib/prisma';
import { UserRole } from '../../../generated/prisma/enums';
import { AppError } from '../../shared/lib/AppError';

export const registerUser = async (data: RegisterInput) => {
    const findExistUser = await prisma.auth.findUnique({
        where: { email: data.email }
    })
    if (findExistUser) {
        throw new AppError("User alredy exist,select unique email address!")
    }
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);

    const result = await prisma.auth.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            passwordHash: hashedPassword,
            role: data.role || UserRole.CANDIDATE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    })
    return result;
}

export const signinUser = async (data: LoginInput) => {
    const findUser = await prisma.auth.findUnique({
        where: { email: data.email }
    })
    if (!findUser) {
        throw new AppError("User don't have value with this email address!",404)
    }
    const checkMatch = await bcrypt.compare(data.passwordHash, findUser.passwordHash)
    if (!checkMatch) {
        throw new AppError("Password Mismatched!",400)
    }
    const token = jwt.sign(
        {
            id: findUser.id,
            role: findUser.role,
        }, process.env.JWT_SECRET!, {
        expiresIn: "7d"
    })
    return { findUser, token }
}

export async function signedOutuser(userId: string) {
    const user = await prisma.auth.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
}
