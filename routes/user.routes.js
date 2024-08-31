import { Router } from "express";

const router = Router();
import {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
  getAllUsers,
  addSubscription,
  removeSubscription,
} from "../controllers/user.controller.js";
import { authorisedRoles, isLoggedIn } from "../middleware/auth.middleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedIn, getProfile);
router.get(
  "/all",
  isLoggedIn,
  authorisedRoles("ADMIN", "INSTRUCTOR"),
  getAllUsers
);
router.post(
  "/addsubscription/:userId",
  isLoggedIn,
  authorisedRoles("ADMIN", "INSTRUCTOR"),
  addSubscription
);
router.delete(
  "/addsubscription/:userId",
  isLoggedIn,
  authorisedRoles("ADMIN", "INSTRUCTOR"),
  removeSubscription
);

router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.post("/change-password", isLoggedIn, changePassword);
router.post("/update/:id", isLoggedIn, updateUser);

export default router;
