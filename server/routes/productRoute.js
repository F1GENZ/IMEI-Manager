import expess from 'express';
import apiProduct from '../controllers/productController.js';
const router = expess.Router();

router.get("/all", apiProduct.getProducts);
router.get("/all/:id", apiProduct.getProduct);

export default router;