import expess from "express";
import apiProduct from "../controllers/productController.js";
const router = expess.Router();

router.get("/all", apiProduct.getProducts);
router.get("/all/:id", apiProduct.getProduct);
router.get("/all/user/get", apiProduct.getUser);
router.put("/all/user/create", apiProduct.createUser);
router.put("/all/user/delete", apiProduct.deleteUser);

export default router;
