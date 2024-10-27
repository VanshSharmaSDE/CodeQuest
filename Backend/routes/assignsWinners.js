const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');
const RoundResult = require('../models/roundResult'); // Assuming round results model is in this path
const Student = require('../models/student'); // Assuming the student model is in this path

// API to determine top 3 students from the last round and update the competition schema
router.post('/:competitionId', async (req, res) => {
    const { competitionId } = req.params;

    try {
        // Step 1: Fetch the competition
        const competition = await Competition.findById({ _id: competitionId }).populate('rounds');

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found.' });
        }

        // Step 2: Get the last round
        const lastRound = competition.rounds[competition.rounds.length - 1];  // Assuming rounds are stored in order
        if (!lastRound) {
            return res.status(400).json({ message: 'No rounds found in this competition.' });
        }

        // Step 3: Get all round results for the last round and populate student names
        const roundResults = await RoundResult.find({ roundId: lastRound._id })
            .sort({ score: -1, submissionTime: 1 })
            .populate({ path: 'studentId', model: Student, select: 'studentName' });  // Populate 'studentId' field with 'name' from Student model

        if (roundResults.length < 3) {
            return res.status(400).json({ message: 'Not enough participants to determine top 3.' });
        }

        // Step 4: Calculate the score based on correct answers (isCorrect === true)
        const scoredResults = roundResults.map((result) => {
            const correctAnswers = result.result.filter(r => r.isCorrect).length; // Count the number of true values in the result array
            return {
                studentId: result.studentId,  // Populated student details
                correctAnswers,  // The student's score
                submissionTime: result.submissionTime  // Submission time for tiebreaker
            };
        });

        // Step 5: Sort by score (correct answers descending), then by submission time (ascending)
        scoredResults.sort((a, b) => {
            if (a.correctAnswers === b.correctAnswers) {
                return new Date(a.submissionTime) - new Date(b.submissionTime); // Earlier submission comes first
            }
            return b.correctAnswers - a.correctAnswers;  // Higher correct answers come first
        });

        // Step 6: Determine the top 3 students
        const winner = scoredResults[0];
        const runnerUp = scoredResults[1];
        const secondRunnerUp = scoredResults[2];

        // Step 7: Update the competition schema with the top 3 students
        competition.winner = winner.studentId.studentName;  // Use student name
        competition.runnerUp = runnerUp.studentId.studentName;  // Use student name
        competition.secondRunnerUp = secondRunnerUp.studentId.studentName;  // Use student name

        await competition.save();

        // Step 6: Return success response with student names
        res.json({
            message: 'Winners assigned successfully.',
            winner: winner.studentId.studentName,  // Return student name
            runnerUp: runnerUp.studentId.studentName,  // Return student name
            secondRunnerUp: secondRunnerUp.studentId.studentName,  // Return student name
        });

    } catch (error) {
        console.error('Error assigning winners:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
