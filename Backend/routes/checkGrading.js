const express = require('express');
const router = express.Router();
const RoundResult = require('../models/roundResult'); // Import your RoundResult model

// Check if all students have their results for a specific competition's round
router.get('/:competitionId/:roundId', async (req, res) => {
    const { competitionId, roundId } = req.params;

    try {
        // Find all results for the specified competition and round
        const roundResults = await RoundResult.find({
            competitionId,
            roundId,
        });

        // Check if all results contain at least one correct answer (`isCorrect: true`) in the result array
        const allGraded = roundResults.length > 0 && roundResults.every(result =>
            result.result && result.result.some(r => typeof r.isCorrect !== 'undefined')
        );
        if (allGraded) {
            // Update the `allGraded` field to true in the roundResults schema
            await RoundResult.updateMany(
                { competitionId, roundId },
                { $set: { allGraded: true } }
            );

            return res.json({
                allGraded: true,
                message: 'All students have been graded, and the round has been marked as all graded.',
            });
        } else {
            return res.json({
                allGraded: false,
                message: 'Some students have not been graded yet or do not have a correct answer.',
            });
        }
    } catch (error) {
        console.error('Error checking grading status:', error);
        return res.status(500).json({
            message: 'Error checking grading status.',
            error: error.message,
        });
    }
});

module.exports = router;
