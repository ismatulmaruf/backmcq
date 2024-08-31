import { Router } from "express";
const router = Router();
import {
  getAExam,
  getAExamAnswer,
  postExamAnswer,
  getAllExams,
  getAllExamsForNonUser,
} from "../controllers/exam.controller.js";
import {
  isLoggedIn,
  authorisedRoles,
  authorizeSubscriber,
} from "../middleware/auth.middleware.js";

router.get("/all/:catId", isLoggedIn, getAllExams);

router.get("/nonUser", getAllExamsForNonUser);

// Fetch the exam
router.get("/:catId/:examId", isLoggedIn, authorizeSubscriber, getAExam);

// Submit the exam
router.post("/:catId/:examId", isLoggedIn, authorizeSubscriber, postExamAnswer);

router.get(
  "/withAns/:catId/:examId",
  isLoggedIn,
  authorizeSubscriber,
  getAExamAnswer
);

export default router;
