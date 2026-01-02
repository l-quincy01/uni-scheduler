import { Request, Response, Router } from "express";
import { Module } from "../../models/Module";

export const getUserModules = async (req: Request, res: Response) => {
  try {
    const docs = await Module.find({}).sort({ category: 1 }).lean();

    return res.status(200).json(docs);
  } catch (err) {
    console.error("[GET /api/modules] failed:", err);
    return res.status(500).json({ error: "Failed to fetch modules" });
  }
};
