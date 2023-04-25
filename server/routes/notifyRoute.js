import express from "express";
import apiNotify from "../controllers/notifyController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, apiNotify.getNotify);
router.post("/", apiNotify.createNotify);
router.delete("/", apiNotify.deleteNotify);

export default router;
