import express from 'express';
import { getJob, getJobs, postJob, searchActiveJobs } from './jobs.controller';
import { createJobSchema, searchJobSchema } from './job.validation';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';

const router = express.Router()

router.post("/post-job",authMiddleware,validate({body:createJobSchema}),postJob)
router.get("/get-jobs",authMiddleware,getJobs)
router.get("/get-job/:jobId",authMiddleware,getJob)
router.get("/search-job",authMiddleware,validate({query:searchJobSchema}),searchActiveJobs)

export default router;