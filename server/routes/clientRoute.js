import expess from "express";
import apiClient from "../controllers/clientController.js";
import protect from "../middlewares/authMiddleware.js";
const router = expess.Router();

router.get("/all", protect, apiClient.getUsers);
router.get("/get", apiClient.getUser);
router.post("/create", apiClient.createClient);
router.put("/update", apiClient.updateClient);
router.put("/", apiClient.deleteClient);
router.get("/flag/:id", apiClient.flagClient);
router.put("/activess", apiClient.activeAllAgencty);

export default router;
