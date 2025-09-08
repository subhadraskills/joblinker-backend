import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { auth } from "../middlewares/auth";

const router = Router();

// Add new job link
router.post("/", auth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL required" });

    const job = await prisma.jobLink.create({
      data: { url, ownerId: req.user.id },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", auth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const jobs = await prisma.jobLink.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });

    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//update
router.put("/:id", auth, async (req: Request & { user?: any }, res: Response) => {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", auth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.jobLink.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.ownerId !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    await prisma.jobLink.delete({ where: { id: Number(id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
