import examModel from "../models/exam.model.js";
import AppError from "../utils/error.utils.js";

// get all courses
const getAllCourses = async (req, res, next) => {
  const { catId } = req.params; // Extracting catId from the request parameters
  try {
    // Finding exams with the matching catId and excluding the 'mcqs' field
    const exams = await examModel.find({ categoryID: catId }).select("-mcqs");

    res.status(200).json({
      success: true,
      message: "Courses for the given category",
      exams,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// create course
const createExam = async (req, res, next) => {
  console.log(req.body);
  try {
    const {
      examNMmbr,
      title,
      description,
      category,
      createdBy,
      time,
      free,
      AddmissionExam,
      categoryID,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !createdBy ||
      !time ||
      !examNMmbr
    ) {
      return next(new AppError("All fields are aaa", 400));
    }

    const course = await examModel.create({
      examNMmbr,
      title,
      description,
      category,
      createdBy,
      time,
      free,
      AddmissionExam,
      categoryID,
    });

    if (!course) {
      return next(
        new AppError("Course could not created, please try again", 500)
      );
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course successfully created",
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// update course
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await examModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );

    if (!course) {
      return next(new AppError("Course with given id does not exist", 500));
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// remove course
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await examModel.findById(id);

    if (!course) {
      return next(new AppError("Course with given id does not exist", 500));
    }

    await examModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "course deleted successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

//add by me get specific course mcq
const getMCQsByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the course by ID
    const course = await examModel.findById(id);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Extract MCQs from the course
    const mcqs = course.mcqs;

    res.status(200).json({
      success: true,
      message: "MCQs retrieved successfully",
      mcqs,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// add by me for mcq post
const addMCQsToCourseById = async (req, res, next) => {
  try {
    const { mcqs } = req.body; // Expecting an array of MCQs
    const { id } = req.params;

    if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
      return next(new AppError("At least one MCQ is required", 400));
    }

    const course = await examModel.findById(id);

    if (!course) {
      return next(new AppError("Course with given ID does not exist", 404));
    }

    const mcqDataArray = mcqs.map((mcq) => {
      const { question, options, correctAnswer, detailsAnswer } = mcq;

      if (!question || !options || !correctAnswer || options.length < 2) {
        throw new AppError(
          "Each MCQ must include a question, at least two options, and a correct answer",
          400
        );
      }

      return {
        question,
        options,
        correctAnswer,
        detailsAnswer,
      };
    });

    course.mcqs.push(...mcqDataArray);
    course.numberOfMCQs = course.mcqs.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "MCQs added successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// add by me delete mcq with id
const deleteCourseMCQ = async (req, res, next) => {
  try {
    const { courseId, mcqId } = req.query;

    // Find the course by ID
    const course = await examModel.findById(courseId);

    // If the course is not found, return an error
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Find the index of the MCQ to be deleted
    const mcqIndex = course.mcqs.findIndex(
      (mcq) => mcq._id.toString() === mcqId
    );

    // If the MCQ is not found, return an error
    if (mcqIndex === -1) {
      return next(new AppError("MCQ not found in the course", 404));
    }

    // Remove the MCQ from the array
    course.mcqs.splice(mcqIndex, 1);

    // Update the number of MCQs in the course
    course.numberOfMCQs = course.mcqs.length;

    // Save the updated course document
    await course.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: "MCQ deleted successfully",
    });
  } catch (e) {
    // Handle any errors
    return next(new AppError(e.message, 500));
  }
};

// add by me update MCQ by course id and lecture id
const updateCourseMCQ = async (req, res, next) => {
  try {
    const { courseId, mcqId } = req.query;
    const { question, options, correctAnswer, detailsAnswer } = req.body;

    // Check if all fields are provided
    if (!question || !options || !correctAnswer || !detailsAnswer) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await examModel.findById(courseId);

    // Check if the course exists
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Find the MCQ by ID
    const mcqIndex = course.mcqs.findIndex(
      (mcq) => mcq._id.toString() === mcqId
    );

    // Check if the MCQ exists
    if (mcqIndex === -1) {
      return next(new AppError("MCQ not found in the course", 404));
    }

    // Update the MCQ data
    const updatedMCQData = {
      question,
      options,
      correctAnswer,
      detailsAnswer,
    };

    // Update the MCQ details in the course
    course.mcqs[mcqIndex] = updatedMCQData;

    // Save the updated course
    await course.save();

    res.status(200).json({
      success: true,
      message: "MCQ updated successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

export {
  getAllCourses,
  getMCQsByCourseId,
  createExam,
  updateCourse,
  removeCourse,
  addMCQsToCourseById,
  deleteCourseMCQ,
  updateCourseMCQ,
};
