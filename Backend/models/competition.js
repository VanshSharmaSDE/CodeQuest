const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for questions
const questionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: false // Only required for text and mcq questions
  },
  options: {
    type: [String],
    default: []
  }
});

// Define the schema for rounds
const roundSchema = new Schema({
  roundNumber: {
    type: Number,
    required: true
  },
  roundType: {
    type: String,
    enum: ['TEXT', 'MCQ', 'CODE'],
    required: true
  },
  isRoundLive: {
    type: Boolean,
    default: false,
  },
  roundDuration: Number,
  roundStartTiming: String,
  questions: [questionSchema] // Array of questions
});

// Define the schema for competitions
const competitionSchema = new Schema({
  competitionName: {
    type: String,
    required: true
  },
  creatorId: {
    type: String,
    required: true
  },
  rounds: [roundSchema], // Array of rounds
  id: {
    type: Number,
    // required: true
  },
  isLive: {
    type: Boolean,
    default: false
  },
  startTiming: {
    type: String,
    default: ""
  },
  lastSaved: {
    type: String
  },
  previousCompetition: { type: Boolean,default:false },
  winner: { type: String, default: null },
  runnerUp: { type: String, default: null },
  secondRunnerUp: { type: String, default: null },
});

// Create and export the Competition model
const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
