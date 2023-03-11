import expess from "express";
import apiFile from "../controllers/fileController.js";
import excelUploads from "../configs/multer.js";
const router = expess.Router();

router.post("/import", excelUploads.single("csvFile"), apiFile.importCSV);
router.get("/export/all", excelUploads.single("csvFile"), apiFile.exportAll);
router.get("/export/none-imei", excelUploads.single("csvFile"), apiFile.exportNoneImei);

export default router;
