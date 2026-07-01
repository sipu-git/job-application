import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { setIO } from './src/shared/integrations/configs/socket.config';
import userRoutes from './src/modules/auth-service/auth.routes';
import jobRoutes from './src/modules/job-services/jobs.routes';
import { jobSocket } from './src/modules/job-services/job.socket';
import profileRoutes from './src/modules/profile-service/profile.routes';

const app = express()

app.use(cors({
    origin:"*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*",
    }
})
setIO(io)
jobSocket(io);
app.use("/api/auth",userRoutes)
app.use("/api/jobs",jobRoutes)
app.use("/api/profile",profileRoutes)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`)
})