import { Router } from "express";
const router = Router();
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";
import {
  isLoggedIn,
  authorisedRoles,
  authorizeSubscriber,
} from "../middleware/auth.middleware.js";

router.post("/", isLoggedIn, authorisedRoles("ADMIN"), addCategory);
router.get("/", isLoggedIn, getCategories);
router.put("/:id", isLoggedIn, authorisedRoles("ADMIN"), updateCategory);
router.delete("/:id", isLoggedIn, authorisedRoles("ADMIN"), deleteCategory);

export default router;
