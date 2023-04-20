import express from "express";
import apiNotify from "../controllers/notifyController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, apiNotify.getNotify);
router.post("/", apiNotify.createNotifyFetch);
router.delete("/", apiNotify.deleteNotify);

export default router;
