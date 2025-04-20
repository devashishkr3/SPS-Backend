const Event = require("../../models/eventModel");
const cloudinary = require("../../config/cloudinaryConfig");
const fs = require("fs-extra");
const upload = require("../../utils/multerConfig");

const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    console.log(req.file);
    console.log(req.body);

    if (!title || !description) {
      return res.status(404).json({
        message: "title , description are required.",
        success: false,
      });
    }

    if (!req.file) {
      return res.status(404).json({
        message: "Event Attachment is Required",
        success: false,
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "SPS/Event",
    });

    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.log("Error Deleting File", unlinkError);
    }

    const newEvent = new Event({
      title,
      description,
      date,
      attachment: result.secure_url,
      attachmentID: result.public_id,
    });

    await newEvent.save();

    return res.status(201).json({
      message: "Event Created Succcessfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//get all notice
const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    if (!events) {
      return res.status(404).json({
        message: "Events Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Events Found",
      success: true,
      data: events,
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//DELETE
const deleteEvent = async (req, res) => {
  try {
    const { eventID } = req.params;
    console.log(req.params);

    if (!eventID) {
      res.status(400).json({
        message: "Event ID is Required",
        success: false,
      });
    }
    const event = await Event.findById(eventID);

    if (!event) {
      res.status(404).json({
        message: "event Not Found",
        success: false,
      });
    }

    if (event.attachmentID) {
      await cloudinary.uploader.destroy(event.attachmentID);
    }

    await Event.findByIdAndDelete(eventID);

    return res.status(200).json({
      message: "Event Deleted SuccessFully",
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

module.exports = { createEvent, getAllEvent, deleteEvent };
