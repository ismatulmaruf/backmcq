// models/Category.js
import { model, Schema } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number, // Assuming price is a number
    required: true,
  },
  details: {
    type: String, // Assuming details is a text field
    required: true,
  },
  image: {
    type: String, // Assuming the image is stored as a URL
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = model("Category", CategorySchema);

export default Category;
