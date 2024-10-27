const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true,
  },
  roundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  answers: [
    {
      question: String,
      answer: String,
      language:String,
    },
  ],
  submissionTime: {
    type: Date,
    default: Date.now, // Automatically records the time of submission
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  isChecked: { type: Boolean, default: false } // Add the isChecked field
});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;
