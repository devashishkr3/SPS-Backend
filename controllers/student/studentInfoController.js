const sendStudentInfo = async (req, res) => {
  return res.status(200).json({
    message: "Student details fetched successfully",
    success: true,
    student: req.student,
  });
};

module.exports = {
  sendStudentInfo,
};
