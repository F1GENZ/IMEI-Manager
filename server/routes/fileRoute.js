import expess from "express";
import apiFile from "../controllers/fileController.js";
import excelUploads from "../configs/multer.js";
const router = expess.Router();

router.post("/", excelUploads.single("csvFile"), apiFile.excelFile);

export default router;
