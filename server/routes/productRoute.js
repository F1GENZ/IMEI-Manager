import expess from "express";
import apiProduct from "../controllers/productController.js";
import protect from "../middlewares/authMiddleware.js";
const router = expess.Router();

router.get("/all", protect, apiProduct.getProducts);
router.get("/all/:id", protect, apiProduct.getProduct);
router.put("/all/update/:id", apiProduct.updateProduct);
router.put("/all/deleteUser/:id", apiProduct.deleteUser);

export default router;
