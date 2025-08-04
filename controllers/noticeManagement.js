const Notice = require("../models/noticeModel");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs-extra");
const upload = require("../utils/multerConfig");

exports.createNotice = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    console.log(req.body);
    console.log(req.file);

    if (!title || !description) {
      return res.status(404).json({
        message: "title and description are required.",
        success: false,
      });
    }

    if (!req.file) {
      return res.status(404).json({
        message: "Notice Attachment is Required",
        success: false,
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "SPS/Notice",
    });

    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.log("Error Deleting File", unlinkError);
    }

    const newNotice = new Notice({
      title,
      description,
      date,
      attachment: result.secure_url,
      attachmentID: result.public_id,
    });

    await newNotice.save();

    return res.status(201).json({
      message: "Notice Created Succcessfully",
      success: true,
    });
  } catch (err) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//get all notice
exports.getAllNotice = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    if (!notices) {
      return res.status(404).json({
        message: "Notices Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Notices Found",
      success: true,
      data: notices,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//DELETE
exports.deleteNotice = async (req, res) => {
  try {
    const { noticeID } = req.params;
    if (!noticeID) {
      res.status(400).json({
        message: "Notice ID is Required",
        success: false,
      });
    }
    const notice = await Notice.findById(noticeID);

    if (!notice) {
      res.status(404).json({
        message: "Notice Not Found",
        success: false,
      });
    }

    if (notice.attachmentID) {
      await cloudinary.uploader.destroy(notice.attachmentID);
    }

    await Notice.findByIdAndDelete(noticeID);

    return res.status(200).json({
      message: "Notice Deleted SuccessFully",
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
