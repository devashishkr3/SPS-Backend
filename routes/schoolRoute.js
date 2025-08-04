const express = require("express");
const router = express.Router();
const galleryManagement = require("../controllers/galleryManagement");
const noticeManagement = require("../controllers/noticeManagement");
const eventManagement = require("../controllers/eventManagement");
const contactUsController = require("../controllers/contactUsController");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

router.get("/get-all-notice", noticeManagement.getAllNotice);
router.get("/get-all-events", eventManagement.getAllEvent);
router.get("/get-all-images", galleryManagement.getAllImages);
router.post("/contact-us", contactUsController.contactUs);

module.exports = router;
