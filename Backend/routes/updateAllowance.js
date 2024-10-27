const express = require('express');
const router = express.Router();
const Student = require('../models/student'); // Assuming your Student model is stored in ../models/student
const RoundResult = require('../models/roundResult'); // Assuming you have a RoundResult schema

// API to check result and update allowance field
router.post('/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        // Fetch student's round results from the round results collection
        const roundResults = await RoundResult.find({
            studentId: studentId
        });

        if (!roundResults || roundResults.length === 0) {
            return res.status(404).json({ message: 'No results found for the student.' });
        }

        // Calculate the total number of questions and the number of correct answers
        let totalQuestions = 0;
        let correctAnswers = 0;

        roundResults.forEach(result => {
            totalQuestions += result.result.length;  // Assuming result.result is an array of answers
            correctAnswers += result.result.filter(ans => ans.isCorrect === true).length;
        });

        // Calculate percentage
        const percentage = (correctAnswers / totalQuestions) * 100;

        // Fetch the student record
        const student = await Student.findOne({ _id:studentId });

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Update the allowance field based on the percentage
        if (percentage >= 40) {
            student.allowance = true;  // Student is allowed to join the next round
        } else {
            student.allowance = false; // Student is restricted from the next round
        }

        // Save the updated student record
        await student.save();

        res.json({
            message: `Student ${student.studentName}'s allowance updated successfully.`,
            allowance: student.allowance
        });

    } catch (error) {
        console.error('Error updating student allowance:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
