import { Request, Response } from "express";
import prisma from "../lib/prisma";


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


export const updateJob = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    const existing = await prisma.jobLink.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.ownerId !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    const updated = await prisma.jobLink.update({
      where: { id: Number(id) },
      data: { url },
      include: { owner: { select: { id: true, name: true } } },
    });

    res.json({ updated });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const deleteJob = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.jobLink.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.ownerId !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    await prisma.jobLink.delete({ where: { id: Number(id) } });
    res.json({ message: "Deleted" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
