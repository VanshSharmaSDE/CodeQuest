// const express = require('express');
// const router = express.Router();
// const Competition = require('../models/competition');

// // GET route to retrieve all competitions where isLive is true
// router.get('/', async (req, res) => {
//     try {
//         // Find competitions where isLive is true
//         const liveCompetitions = await Competition.find({ isLive: true });

//         // If no live competitions found
//         if (liveCompetitions.length === 0) {
//             return res.status(404).json({ message: 'No live competitions found' });
//         }

//         // Return the live competitions
//         res.status(200).json(liveCompetitions);
//     } catch (error) {
//         console.error('Error fetching live competitions:', error);
//         res.status(500).json({ error: 'An error occurred while fetching live competitions.' });
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

// GET route to retrieve all live competitions of a particular teacher
router.get('/:teacherId', async (req, res) => {
    const { teacherId } = req.params;

    try {
        // Find live competitions where isLive is true and teacherId matches
        const liveCompetitions = await Competition.find({ isLive: true, creatorId: teacherId });

        // If no live competitions found for the teacher
        if (liveCompetitions.length === 0) {
            return res.status(404).json({ message: 'No live competitions found for this teacher.' });
        }

        // Return the live competitions for the teacher
        res.status(200).json(liveCompetitions);
    } catch (error) {
        console.error('Error fetching live competitions for the teacher:', error);
        res.status(500).json({ error: 'An error occurred while fetching live competitions for this teacher.' });
    }
});

router.get('/', async (req, res) => {
    const { teacherId } = req.params;

    try {
        // Find live competitions where isLive is true and teacherId matches
        const liveCompetitions = await Competition.find({ isLive: true });

        // If no live competitions found for the teacher
        if (liveCompetitions.length === 0) {
            return res.status(404).json({ message: 'No live competitions found for this teacher.' });
        }

        // Return the live competitions for the teacher
        res.status(200).json(liveCompetitions);
    } catch (error) {
        console.error('Error fetching live competitions for the teacher:', error);
        res.status(500).json({ error: 'An error occurred while fetching live competitions for this teacher.' });
    }
});

module.exports = router;
