const express = require('express');
const router = express.Router();
const roundResult = require('../models/roundResult'); // Assuming you have your schema in this path
const Answer = require('../models/answer'); // Import the Answer schema

// POST route to save the result for a round
router.post('/', async (req, res) => {
    try {
        const { competitionId, roundId, studentId, result, submissionTime } = req.body;

        // Validate input
        if (!competitionId || !roundId || !studentId || !result || !submissionTime || !Array.isArray(result)) {
            return res.status(400).json({ message: 'Missing or invalid data' });
        }

        // Check if the result for the student in the same competition and round already exists
        const existingResult = await roundResult.findOne({ competitionId, roundId, studentId });

        if (existingResult) {
            return res.status(400).json({ message: 'Student result already saved' });
        }

        // Create a new round result document
        const newResult = new roundResult({
            competitionId,
            roundId,
            studentId,
            result,  // Array of results (questionId and isCorrect)
            submissionTime,
        });

        // Save the result to the database
        await newResult.save();

        // After successful result submission, update the isChecked field in Answer schema
        await Answer.findOneAndUpdate(
            { competitionId, roundId, studentId }, // Match the document
            { isChecked: true }, // Set isChecked to true
            { new: true } // Return the updated document
        );

        res.status(201).json({ message: 'Result saved successfully and answer checked', data: true });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
