import { model, Schema } from "mongoose";

const examSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
      minLength: [4, "Title must be at least 8 characters"],
      maxLength: [59, "Title should be less than 60 characters"],
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minLength: [8, "Description must be at least 8 characters"],
      maxLength: [500, "Description should be less than 500 characters"],
    },
    time: {
      type: Number,
      required: true,
    },
    examNMmbr: {
      type: Number,
      required: true,
    },
    free: {
      type: Boolean,
      required: true,
    },
    AddmissionExam: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    categoryID: {
      type: String,
      required: [true, "CategoryId is required"],
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    // lectures: [
    //   {
    //     title: String,
    //     description: String,
    //     lecture: {
    //       public_id: {
    //         type: String,
    //       },
    //       secure_url: {
    //         type: String,
    //       },
    //     },
    //   },
    // ],
    // numberOfLectures: {
    //   type: Number,
    //   default: 0,
    // },
    mcqs: [
      {
        question: {
          type: String,
          required: [true, "Question is required"],
        },
        options: {
          type: [String], // Array of strings for options
          required: [true, "Options are required"],
          validate: {
            validator: function (v) {
              return v.length >= 2; // At least two options required
            },
            message: "There must be at least two options",
          },
        },
        correctAnswer: {
          type: String,
          required: [true, "Correct answer is required"],
        },
        detailsAnswer: {
          type: String,
          required: [true, "details answer is required"],
          default: "hladjfl",
        },
      },
    ],
    numberOfMCQs: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = model("Exam", examSchema);

export default Exam;
