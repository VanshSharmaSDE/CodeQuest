const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher'); // Import your Mongoose model
const multer = require('multer'); // To handle image uploads
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp
  }
});

const upload = multer({ storage: storage });

// Route to handle teacher update
router.post('/', upload.single('image'), async (req, res) => {
  const { name, email, _id, password } = req.body;

  try {
    // Find the teacher by loginId (or any unique identifier like email)
    const teacher = await Teacher.findOne({ _id });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // If teacher has an existing image, delete the old image
    if (teacher.teacherImage) {
      // If it's stored as a full URL, replace the base URL with 'uploads/'
      const relativeImagePath = teacher.teacherImage.replace(/^http:\/\/192\.168\.31\.52:5000\/uploads\//, 'uploads/');
      // Get the full path to the old image
      const oldImagePath = path.join(__dirname, '..', relativeImagePath);
      // Check if the file exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
    }


    // Update teacher details
    teacher.teacherName = name || teacher.teacherName;
    teacher.teacherEmail = email || teacher.teacherEmail;

    // If password is provided, hash the new password and update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      teacher.teacherPassword = hashedPassword;
    }


    const newBaseURL = `${process.env.API_URL}5000`;

    // If a new image is uploaded, update the teacherImage field
    if (req.file) {
      teacher.teacherImage = `${newBaseURL}/uploads/${req.file.filename}`; // Save the image path
    }

    // Save the updated teacher details to the database
    await teacher.save();

    res.status(200).json({ message: 'Teacher updated successfully', teacher });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error });
  }
});

module.exports = router;
