const express = require('express');
const router = express.Router();
const Student = require('../models/student'); // Assuming your Student model is stored here

// API to check student allowance
router.get('/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Find the student by studentId
    const student = await Student.findOne({ _id:studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Check the allowance field
    if (student.allowance) {
      res.json({ allowed: true });
    } else {
      res.json({
        allowed: false,
        message: "You are not allowed due to your performance or behavior."
      });
    }

  } catch (error) {
    console.error('Error checking student allowance:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
