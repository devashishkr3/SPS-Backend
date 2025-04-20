const sendTeacherInfo = (req, res) => {
  res.status(200).json({
    message: "Teacher details fetched successfully",
    success: true,
    teacher: req.teacher,
  });
};

module.exports = {
  sendTeacherInfo,
};
