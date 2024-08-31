import examModel from "../models/exam.model.js";
import User from "../models/user.model.js";

const getAExam = async (req, res) => {
  try {
    const examId = req.params.examId;
    const exam = await examModel
      .findById(examId)
      .select("-mcqs.correctAnswer -mcqs.detailsAnswer");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// const postExamAnswer = async (req, res) => {
//   try {
//     const examId = req.params.id;
//     const submittedAnswers = req.body.answers;
//     const { id: userId } = req.user;

//     const exam = await examModel.findById(examId);
//     if (!exam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     let score = 0;

//     exam.mcqs.forEach((mcq) => {
//       const correctAnswer = mcq.correctAnswer;
//       const submittedAnswer = submittedAnswers[mcq._id.toString()];

//       if (submittedAnswer && submittedAnswer === correctAnswer) {
//         score++;
//       }
//     });

//     const totalQuestions = exam.mcqs.length;
//     const percentage = (score / totalQuestions) * 100;

//     // Update or add the exam result in the user's document
//     const user = await User.findById(userId);

//     const existingResultIndex = user.examResults.findIndex(
//       (result) => result.examId.toString() === examId
//     );

//     console.log(existingResultIndex);

//     if (existingResultIndex > -1) {
//       // Update existing result
//       user.examResults[existingResultIndex] = {
//         examId,
//         score,
//         totalQuestions,
//         percentage,
//         submittedAnswers,
//         dateSubmitted: new Date(),
//       };
//     } else {
//       // Add new result
//       user.examResults.push({
//         examId,
//         score,
//         totalQuestions,
//         percentage,
//         submittedAnswers,
//         dateSubmitted: new Date(),
//       });
//     }

//     await user.save();

//     res.json({
//       score,
//       totalQuestions,
//       percentage,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred", error });
//   }
// };

const postExamAnswer = async (req, res) => {
  try {
    const examId = req.params.examId;
    const submittedAnswers = req.body.answers;
    const { id: userId } = req.user;

    // Find the exam by ID
    const exam = await examModel.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;
    const penalty = 0.25; // Penalty for each incorrect answer
    let incorrectAnswersCount = 0;
    const wrongAnswers = {}; // Object to store wrong answers

    // Calculate score, incorrect answers, and record wrong answers
    exam.mcqs.forEach((mcq) => {
      const correctAnswer = mcq.correctAnswer;
      const submittedAnswer = submittedAnswers[mcq._id.toString()];

      if (submittedAnswer === correctAnswer) {
        score++;
      } else if (submittedAnswer) {
        incorrectAnswersCount++;
        wrongAnswers[mcq._id.toString()] = {
          question: mcq.question, // or any other details you want to include
          submittedAnswer,
          correctAnswer,
        };
      }
    });

    // Apply penalty if the exam is an admission test
    if (exam.AddmissionExam) {
      score -= penalty * incorrectAnswersCount;
    }

    // Ensure the score does not go below zero
    // score = Math.max(score, 0);

    const totalQuestions = exam.mcqs.length;
    const percentage = (score / totalQuestions) * 100;

    // Update or add the exam result in the user's document
    const user = await User.findById(userId);

    const existingResultIndex = user.examResults.findIndex(
      (result) => result.examId.toString() === examId
    );

    if (existingResultIndex > -1) {
      // Update existing result
      user.examResults[existingResultIndex] = {
        examId,
        score,
        totalQuestions,
        percentage,
        submittedAnswers,
        incorrectAnswersCount,
        dateSubmitted: new Date(),
      };
    } else {
      // Add new result
      user.examResults.push({
        examId,
        score,
        totalQuestions,
        percentage,
        submittedAnswers,
        incorrectAnswersCount,
        dateSubmitted: new Date(),
      });
    }

    await user.save();

    res.json({
      score,
      totalQuestions,
      percentage,
      incorrectAnswersCount, // Include wrong answers in the response if needed
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

const getAExamAnswer = async (req, res) => {
  try {
    const examId = req.params.examId; // Extract exam ID from the request parameters

    // Find the exam by ID
    const exam = await examModel.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Return the full exam with answers if the user is authorized
    return res.json(exam);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllExams = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is available in req.user
    const { catId } = req.params; // Extract category ID from route parameters
    const user = await User.findById(id).select("subscribe examResults"); // Fetch user's subscribed exams and exam results

    console.log(catId);

    // Find exams that belong to the specified category
    const exams = await examModel.find({ categoryID: catId }).select("-mcqs");

    if (!exams || exams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found in this category" });
    }

    // Create a set of exam IDs that the user has results for
    const completedExamIds = new Set(
      user.examResults.map((result) => result.examId.toString())
    );

    // Map over exams and add an 'isAccessible' property to each
    const processedExams = exams.map((exam) => {
      const isAccessible = exam.free || user.subscribe.includes(catId);
      const canSeeResult = completedExamIds.has(exam._id.toString());
      return {
        ...exam.toObject(),
        isAccessible,
        canSeeResult, // true if the user can see the results or the exam is accessible
      };
    });

    res.json(processedExams);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

const getAllExamsForNonUser = async (req, res) => {
  try {
    const exams = await examModel.find({}).select("-mcqs");

    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "No exams found" });
    }

    res.json(exams); // Directly send the response
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAExam,
  postExamAnswer,
  getAExamAnswer,
  getAllExams,
  getAllExamsForNonUser,
};
