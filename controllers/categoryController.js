import express from "express";
import Category from "../models/Category.js";
import ResponseHandler from "../utils/ResponseHandler.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return ResponseHandler.error(res, "Category already exists", 400);
    }

    const category = new Category({ name, description, image });
    await category.save();

    return ResponseHandler.success(
      res,
      "Category created successfully",
      category
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return ResponseHandler.success(
      res,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return ResponseHandler.error(res, "Category not found", 404);
    }
    return ResponseHandler.success(
      res,
      "Category fetched successfully",
      category
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, image } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, image },
      { new: true }
    );

    if (!updatedCategory) {
      return ResponseHandler.error(res, "Category not found", 404);
    }

    return ResponseHandler.success(
      res,
      "Category updated successfully",
      updatedCategory
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    return ResponseHandler.error(res, "Category not found", 404);
  }
  return ResponseHandler.success(
    res,
    "Category deleted successfully",
    deletedCategory
  );
};

export const searchCategories = async (req, res) => {
  try {
    const { keyword } = req.query;
    const categories = await Category.find({
      name: { $regex: keyword, $options: "i" },
    });
    return ResponseHandler.success(
      res,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};
