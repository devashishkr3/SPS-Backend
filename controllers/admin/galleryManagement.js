// const Gallery = require("../../models/galleryModel");
// const cloudinary = require("../../config/cloudinaryConfig");
// const upload = require("../../utils/multerConfig");
// const fs = require("fs-extra");

// //Adding Images In Gallery
// const addGalleryImages = async (req, res) => {
//   console.log(req.files);
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         message: "No Images Uploaded!",
//         success: false,
//       });
//     }
//     let uploadedImages = [];

//     for (const file of req.files) {
//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "SPS/Gallery",
//       });

//       uploadedImages.push({
//         imageURL: result.secure_url,
//         imageID: result.public_id,
//       });

//       await fs.unlink(file.path);
//     }

//     const newGallery = new Gallery({ images: uploadedImages });
//     await newGallery.save();

//     return res.status(200).json({
//       message: "Image Saved SuccessFully",
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

// //Get All Images from Gallery
// const getAllImages = async (req, res) => {
//   try {
//     const allImages = await Gallery.find();
//     if (!allImages) {
//       return res.status(404).json({
//         message: "No Images Found",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       message: "Images Found",
//       success: true,
//       data: allImages,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

// //Delete Image from Gallery
// const deleteImage = async (req, res) => {
//   try {
//     const { imageID } = req.params;
//     const imgID = `SPS/Gallery/${imageID}`;

//     const image = await Gallery.findOne({
//       "images.imageID": imgID,
//     });

//     if (!image) {
//       return res.status(404).json({
//         message: "Image not found!",
//         success: false,
//       });
//     }

//     await Gallery.updateOne({}, { $pull: { images: { imageID: imgID } } });

//     await cloudinary.uploader.destroy(imgID);

//     const updatedGallery = await Gallery.findOne();
//     if (updatedGallery && updatedGallery.images.length === 0) {
//       await Gallery.deleteOne();
//     }

//     return res.status(200).json({
//       message: "Image Deleted SuccessFully",
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

// module.exports = { addGalleryImages, getAllImages, deleteImage };

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

    // Creating new image entry
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
    const allImages = await Gallery.find();
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
