const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const path = require('path');

// Route to get student details by loginId (or by MongoDB _id if that's intended)
router.get('/:id', async (req, res) => {
  const id = req.params.id; // Correctly extract id from the route parameters

  try {
    // Find the student by loginId or _id (depending on what the id represents)
    // If loginId is a unique identifier for students, use the second query
    const student = await Student.findById(id); // or use `Student.findOne({ loginId: id })` if querying by loginId

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Generate the image URL (ensure consistent forward slashes)
    const imageUrl = student.studentImage
      ? `${student.studentImage.replace(/\\/g, '/')}` // Ensure consistent forward slashes
      : `${process.env.API_URL}5000/uploads2/default.png`; // Default image if no image exists

    // Return the student's information
    res.status(200).json({
      id: student._id,
      name: student.studentName,
      email: student.studentEmail,
      // password:student.studentPassword,
      image: imageUrl,
      loginTime :student.loginTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student details', error });
  }
});

module.exports = router;
