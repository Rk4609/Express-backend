import { Router } from "express";
import { createProduct ,getAllProducts,updateProduct,deleteProduct} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/",
  upload.array("images", 5),
  createProduct
);


router.get("/", getAllProducts);
router.put(
  "/:id",
  upload.array("images", 5),
  updateProduct
);

router.delete("/:id", deleteProduct);


export default router;
