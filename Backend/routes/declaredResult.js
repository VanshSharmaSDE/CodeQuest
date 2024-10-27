const express = require('express');
const router = express.Router();
const roundResult = require('../models/roundResult');
const Student = require('../models/student');

// API to get declared results for a particular round
router.get('/:roundId', async (req, res) => {
    const { roundId } = req.params;

    try {
        const results = await roundResult.find({ roundId });

        // Check if all students have been graded (allGraded should be true)
        const allGraded = results.every(result => result.allGraded === true);

        if (!allGraded) {
            return res.status(400).json({
                message: 'Some students have not been graded yet.'
            });
        }

        const sortedResults = results.sort((a, b) => {
            const correctAnswersA = a.result.filter((ans) => ans.isCorrect).length;
            const correctAnswersB = b.result.filter((ans) => ans.isCorrect).length;

            // Sort by number of correct answers first
            if (correctAnswersA !== correctAnswersB) {
                return correctAnswersB - correctAnswersA;
            }

            // If correct answers are the same, sort by submission time
            return new Date(a.submissionTime) - new Date(b.submissionTime);
        });

        // Populate student information from their student IDs (assumes a Student model exists)
        const populatedResults = await Promise.all(
            sortedResults.map(async (result) => {
                const student = await Student.findById(result.studentId);
                return {
                    ...result.toObject(),
                    name: student.studentName,
                    score: result.result.filter((r) => r.isCorrect).length,
                };
            })
        );

        res.json(populatedResults);
    } catch (error) {
        console.error('Error fetching declared results:', error);
        res.status(500).json({ error: 'Failed to fetch declared results' });
    }
});

module.exports = router;
