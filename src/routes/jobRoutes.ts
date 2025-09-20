
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { addJob, getJobs, updateJob, deleteJob } from "../controllers/jobController";

const router = Router();


router.post("/", auth, addJob);          
router.get("/", auth, getJobs);          
router.put("/:id/:ownerId", auth, updateJob);        
router.delete("/:id/:ownerId", auth, deleteJob);        
    
export default router;   
