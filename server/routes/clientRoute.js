import expess from "express";
import apiClient from "../controllers/clientController.js";
import protect from "../middlewares/authMiddleware.js";
const router = expess.Router();

router.get("/all", apiClient.getUsers);
router.get("/get", apiClient.getUser);
router.post("/create", apiClient.createClient);
//router.put("/all/delete", apiClient.deleteUser);

export default router;
