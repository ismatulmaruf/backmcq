import { Router } from "express";
const router = Router();
import {
  getAllCourses,
  getMCQsByCourseId,
  createExam,
  updateCourse,
  removeCourse,
  addMCQsToCourseById,
  deleteCourseMCQ,
  updateCourseMCQ,
} from "../controllers/adminExam.controller.js";
import {
  isLoggedIn,
  authorisedRoles,
  authorizeSubscriber,
} from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

router.route("/withId/:catId").get(getAllCourses); //incomplete

router
  .route("/")
  // .get(getAllCourses) //incomplete
  .post(isLoggedIn, authorisedRoles("ADMIN", "INSTRUCTOR"), createExam) //incomplete
  .delete(isLoggedIn, authorisedRoles("ADMIN", "INSTRUCTOR"), deleteCourseMCQ)
  .put(isLoggedIn, authorisedRoles("ADMIN", "INSTRUCTOR"), updateCourseMCQ);

router
  .route("/:id")
  .get(isLoggedIn, authorisedRoles("ADMIN", "INSTRUCTOR"), getMCQsByCourseId)
  .put(isLoggedIn, authorisedRoles("ADMIN", "INSTRUCTOR"), updateCourse) //incomplete
  .delete(isLoggedIn, authorisedRoles("ADMIN", "INSTRUCTOR"), removeCourse) //incomplete
  .post(
    isLoggedIn,
    authorisedRoles("ADMIN", "INSTRUCTOR"),
    addMCQsToCourseById
  );

export default router;
