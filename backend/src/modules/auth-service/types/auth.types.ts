import { UserRole } from "../../../generated/prisma/enums";

export interface User{
 email:string;
 passwordHash:string;
 role?:UserRole
}