const mongoose = require('mongoose');

const roundResultSchema = new mongoose.Schema({
    competitionId: { type: String, required: true },
    roundId: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    result: [
        {
            isCorrect: Boolean    // true if correct, false if incorrect
        }
    ], // Stores result for each question
    submissionTime: { type: Date, default: Date.now }, // Stores the time of submission
    allGraded: { type: Boolean, default: false },
});

const roundResult = mongoose.model('roundResult', roundResultSchema);

module.exports = roundResult;
