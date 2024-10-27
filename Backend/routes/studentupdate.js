const express = require('express');
const router = express.Router();
const Student = require('../models/student'); // Import your Mongoose model
const multer = require('multer'); // To handle image uploads
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads2/'); // Directory where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp
  }
});

const upload = multer({ storage: storage });

// Route to handle student update
router.post('/', upload.single('image'), async (req, res) => {
  const { name, email, _id, password } = req.body;
  
  try {
    // Find the student by loginId (or any unique identifier like email)
    const student = await Student.findOne({ _id });

    if (!student) {
      return res.status(404).json({ message: 'student not found' });
    }

    // If student has an existing image, delete the old image
    if (student.studentImage) {
      // If it's stored as a full URL, replace the base URL with 'uploads/'
      const relativeImagePath = student.studentImage.replace(/^http:\/\/192\.168\.31\.52:5000\/uploads2\//, 'uploads2/');
      // Get the full path to the old image
      const oldImagePath = path.join(__dirname, '..', relativeImagePath);
      // Check if the file exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      } 
    }

    // Update student details
    student.studentName = name || student.studentName;
    student.studentEmail = email || student.studentEmail;

    // If password is provided, hash the new password and update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      student.studentPassword = hashedPassword;
    }

    const newBaseURL = `${process.env.API_URL}5000`;

    // If a new image is uploaded, update the studentImage field
    if (req.file) {
      student.studentImage = `${newBaseURL}/uploads2/${req.file.filename}` // Save the image path
    }

    // Save the updated student details to the database
    await student.save();

    res.status(200).json({ message: 'student updated successfully', student });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error });
  }
});

module.exports = router;
