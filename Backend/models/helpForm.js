const mongoose = require("mongoose");
const HelpFormSchema = new mongoose.Schema({
    HelperName: {
        type: String,
        required: true
    },
    HelperEmail: {
        type: String,
        required: true,
        unique: true
    },
    HelperQuery: {
        type: String,
        required: true
    }
 
});

module.exports = mongoose.model("HelpForm", HelpFormSchema);