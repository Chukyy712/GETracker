import { Router } from "express";
import { getSystemStatus } from "../services/geService.ts";
import { statusLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

router.get("/", statusLimiter, async (req, res) => {
  const status = await getSystemStatus();
  res.json(status);
});

export default router;
