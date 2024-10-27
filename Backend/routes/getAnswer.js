const express = require('express');
const router = express.Router();
const Answer = require('../models/answer'); // Assuming you have an Answer model for storing answers

// API route to fetch all answers for a given round
router.get('/:roundId', async (req, res) => {
  const { roundId } = req.params;

  try {
    // Fetch all answers related to the round ID
    const answers = await Answer.find({ roundId: roundId });

    if (answers.length === 0) {
      return res.status(404).json({ message: 'No answers found for this round' });
    }

    // Return the answers in the response
    res.status(200).json(answers);
  } catch (error) {
    console.error('Error fetching round answers:', error);
    res.status(500).json({ message: 'Server error while fetching answers' });
  }
});

module.exports = router;
