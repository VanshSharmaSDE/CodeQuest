const mongoose = require("mongoose");
const FeedbackFormSchema = new mongoose.Schema({
    FeedbackType: {
        type: String,
        required: true
    },
     UserFeedback: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("FeedbackForm", FeedbackFormSchema);