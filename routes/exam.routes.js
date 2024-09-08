import { Router } from "express";
const router = Router();
import {
  getAExam,
  getAExamAnswer,
  postExamAnswer,
  getAllExams,
  getResultRanking,
} from "../controllers/exam.controller.js";
import {
  isLoggedIn,
  authorisedRoles,
  authorizeSubscriber,
} from "../middleware/auth.middleware.js";

router.get("/all/:catId", isLoggedIn, getAllExams);

router.get(
  "/ranking/:examId",
  isLoggedIn,
  authorizeSubscriber,
  getResultRanking
);

router.get(
  "/withAns/:catId/:examId",
  isLoggedIn,
  authorizeSubscriber,
  getAExamAnswer
);

// Fetch the exam
router.get("/:catId/:examId", isLoggedIn, authorizeSubscriber, getAExam);

// router.get("/nonUser", getAllExamsForNonUser);

router.post("/:catId/:examId", isLoggedIn, authorizeSubscriber, postExamAnswer);

// Submit the exam

export default router;
