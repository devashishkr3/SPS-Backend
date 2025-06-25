const Gallery = require("../../models/galleryModel");
const cloudinary = require("../../config/cloudinaryConfig");
const upload = require("../../utils/multerConfig");
const fs = require("fs-extra");

// Adding a Single Image to Gallery
const addGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required!",
        success: false,
      });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        message: "Title is required!",
        success: false,
      });
    }

    // Uploading image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "SPS/Gallery",
    });

    // Creating new image
    const newImage = new Gallery({
      title,
      imageURL: result.secure_url,
      imageID: result.public_id,
    });

    await newImage.save();

    // Removing local file after upload
    await fs.unlink(req.file.path);

    return res.status(201).json({
      message: "Image uploaded successfully!",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get All Images from Gallery
const getAllImages = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const skip = (page - 1) * limit;

    const allImages = await Gallery.find().skip(skip).limit(limit);
    const total = await Gallery.countDocuments();

    if (allImages.length === 0) {
      return res.status(404).json({
        message: "No Images Found!",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Images Found!",
      success: true,
      data: allImages,
      pagination: {
        totalItems: total,
        currPage: page,
        totalPage: Math.ceil(total / limit),
        limit: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Delete an Image from Gallery
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        message: "Image not found!",
        success: false,
      });
    }

    // Deleting from Cloudinary
    await cloudinary.uploader.destroy(image.imageID);

    // Deleting from Database
    await Gallery.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Image deleted successfully!",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = { addGalleryImage, getAllImages, deleteImage };
