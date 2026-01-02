import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      type,
      quantity,
      mrp,
      sellingPrice,
      brand,
      isReturnable,
      isPublished
    } = req.body;

    // files from multer
    const files = req.files;

    let imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const cloudinaryRes = await uploadOnCloudinary(file.path);
        if (cloudinaryRes?.url) {
          imageUrls.push(cloudinaryRes.url);
        }
      }
    }

    const product = await Product.create({
      productName,
      type,
      quantity,
      mrp,
      sellingPrice,
      brand,
      images: imageUrls,
      isReturnable,
      isPublished
    });

    return res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      productName,
      type,
      quantity,
      mrp,
      sellingPrice,
      brand,
      isReturnable,
      isPublished
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 🔹 update text fields (only if provided)
    if (productName !== undefined) product.productName = productName;
    if (type !== undefined) product.type = type;
    if (quantity !== undefined) product.quantity = quantity;
    if (mrp !== undefined) product.mrp = mrp;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
    if (brand !== undefined) product.brand = brand;
    if (isReturnable !== undefined) product.isReturnable = isReturnable;
    if (isPublished !== undefined) product.isPublished = isPublished;

    // 🔹 handle images update (optional)
    if (req.files && req.files.length > 0) {
      let imageUrls = [];

      for (const file of req.files) {
        const cloudinaryRes = await uploadOnCloudinary(file.path);
        if (cloudinaryRes?.url) {
          imageUrls.push(cloudinaryRes.url);
        }
      }

      product.images = imageUrls;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/**
 * 🗑️ Delete product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
