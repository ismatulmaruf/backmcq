import Category from "../models/category.model.js";

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, details, image } = req.body;

    let category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.price = price !== undefined ? price : category.price;
    category.details = details || category.details;
    category.image = image || category.image;

    await category.save();

    res.json(category);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, price, details, image } = req.body;

    // Check if category already exists
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category
    category = new Category({ name, price, details, image });
    await category.save();

    res.json(category);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Use deleteOne on the found category instance
    await category.deleteOne();

    res.json({ message: "Category removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export { addCategory, getCategories, updateCategory, deleteCategory };
