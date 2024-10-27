const express = require('express');
const Competition = require('../models/competition'); // Assuming your model file is named Competition.js
const router = express.Router();

router.get('/:competitionId/:roundId', async (req, res) => {
  const { competitionId, _id } = req.params;

  try {
    // Find the competition by its ID
    const competition = await Competition.findOne( {_id:competitionId} );

    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    // Find the specific round within the competition
    const round = competition.rounds.find(r => r.roundId === _id);

    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }

    // Return the round details
    res.status(200).json(round);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
