import express from 'express'
import { createAccount, loginUser } from './auth.controller';
const router = express.Router()
router.post("/user-register", createAccount);
router.post("/user-login", loginUser)

export default router;