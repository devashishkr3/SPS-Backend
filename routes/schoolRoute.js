const express = require("express");
const router = express.Router();

const {
  getAllImages,
  getAllNotice,
  getAllEvent,
  contactUs,
} = require("../controllers/admin/app");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});
router.get("/get-all-notice", getAllNotice);
router.get("/get-all-events", getAllEvent);
router.get("/get-all-images", getAllImages);
router.post("/contact-us", contactUs);

module.exports = router;
