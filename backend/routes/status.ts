import { Router } from "express";
import { getSystemStatus } from "../services/geService.ts";

const router = Router();

router.get("/", async (req, res) => {
  const status = await getSystemStatus();
  res.json(status);
});

export default router;
