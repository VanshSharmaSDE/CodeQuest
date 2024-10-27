const express = require('express');
const router = express.Router();
const Answer = require('../models/answer'); // Import the schema

// API to store answers
router.post('/', async (req, res) => {
  try {
    const { competitionId, roundId, studentId, answers , submissionTime, creatorId } = req.body;

    const newAnswer = new Answer({
      competitionId,
      roundId,
      studentId,
      answers,
      submissionTime,
      creatorId
    });

    await newAnswer.save();
    res.status(200).json({ message: 'Answers submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting answers', error: err });
  }
});

module.exports = router;
