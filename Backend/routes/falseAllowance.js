const express = require('express');
const router = express.Router();
const Student = require('../models/student'); // Assuming your Student model is stored in ../models/student

// API to update student allowance to false
router.post('/:_id', async (req, res) => {
    const { _id } = req.params;

    try {
        // Fetch the student record by studentId
        const student = await Student.findById({ _id });

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Update the allowance field to false
        student.allowance = !student.allowance;

        // Save the updated student record
        await student.save();

        res.json({
            message: `Student ${student.studentName}'s allowance updated to false.`,
            allowance: student.allowance
        });

    } catch (error) {
        console.error('Error updating student allowance:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
