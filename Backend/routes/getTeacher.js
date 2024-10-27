const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const path = require('path');

// Route to get teacher details by ID (MongoDB ObjectId)
router.get('/:id', async (req, res) => {
  const id = req.params.id; // Correctly get id from the route parameters

  try {
    // Find teacher by MongoDB ObjectId (_id)
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Generate the image URL (ensure forward slashes)
    const imageUrl = teacher.teacherImage
      ? `${teacher.teacherImage.replace(/\\/g, '/')}` // Ensure consistent forward slashes
      : `${process.env.API_URL}5000/uploads/default.png`; // Default image if no image exists

    // Return the teacher's information
    res.status(200).json({
      id: teacher._id,
      name: teacher.teacherName,
      email: teacher.teacherEmail,
      // password: teacher.teacherPassword,
      image: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teacher details', error });
  }
});

module.exports = router;
