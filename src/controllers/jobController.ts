import { Request, Response } from "express";
import prisma from "../lib/prisma";

//AddJob
export const addJob = async (req: Request, res: Response) => {
  try {
    const { url ,ownerId } = req.body;     
    console.log(url,ownerId);

    if (!url) return res.status(400).json({ message: "URL required" });
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const job = await prisma.jobLink.create({
      data: {
        url,
        ownerId: Number(ownerId)
      }   
    });     

    res.status(201).json({ job });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//getJobs
export const getJobs = async (req: Request , res: Response) => {

  try {
    const jobs = await prisma.jobLink.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
      
    res.status(200).json({ jobs });   
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const updateJob = async (req: Request, res: Response) => {
  try {
   
    const {id, ownerId } = req.params;         
    const { url } = req.body;    
    console.log(id, url, ownerId);

    if (!id) return res.status(400).json({ message: "Job ID required" });
    if (!url) return res.status(400).json({ message: "URL required" });
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await prisma.jobLink.findUnique({
      where: { id: Number(id) }
    });
    console.log(existing?.ownerId);

    if (!existing) return res.status(404).json({ message: "Job not found" });
    if (existing.ownerId !== Number(ownerId))
      return res.status(403).json({ message: "Not allowed" });

    const job = await prisma.jobLink.update({
      where: { id: Number(id) },
      data: { url },
      include: { owner: { select: { id: true, name: true, email: true } } }
    });

    res.status(200).json({ job });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

   
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id, ownerId } = req.params;  
    console.log(id, ownerId);

    if (!id) return res.status(400).json({ message: "Job ID required" });
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await prisma.jobLink.findUnique({
      where: { id: Number(id) }
    });

    console.log(existing?.ownerId);        

  
    if (existing?.ownerId !== Number(ownerId)){
      return res.status(403).json({ message: "user have not authorized to delete" });
    }

    await prisma.jobLink.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }    
};
