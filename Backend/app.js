const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const auth = require('./routes/auth');
const competition = require('./routes/competitionRoutes');
const getcompetition = require('./routes/getComptData');
const teacherupdate = require('./routes/teacherupdate');
const studentupdate = require('./routes/studentupdate');
const getteacher = require('./routes/getTeacher');
const getstudent = require('./routes/getStudent');
const updatedCompetition = require('./routes/updateCompetition')
const deleteCompetition = require('./routes/deleteCompetition');
const liveCompetition = require('./routes/liveCompetition');
const getLiveCompetition = require('./routes/getLiveCompetition');
const liveRound = require('./routes/roundLive');
const submitAnswer = require('./routes/submitAnswer');
const getAnswer = require('./routes/getAnswer');
const getRound = require('./routes/getRound');
const roundResult = require('./routes/roundResult');
const checkGrading = require('./routes/checkGrading');
const declaredResult = require('./routes/declaredResult');
const updateAllowance = require('./routes/updateAllowance');
const checkAllowance = require('./routes/checkAllowance');
const assignWinners = require('./routes/assignsWinners');
const getcompetitionByStudentId = require('./routes/getCompetitionByStudentId');
const enroll = require('./routes/enroll');
const disallow = require('./routes/falseAllowance');
const forgotPassword = require('./routes/forgotPassword');
const enrolledStudents = require('./routes/enrolledStudents');
const previousCompetitions = require('./routes/previousCompetition');
const unLive = require('./routes/unLive');
const UandP = require('./routes/UandP');
const helpForm = require("./routes/HelpForm")
const feedbackForm = require("./routes/feedbackform")

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());


app.use(session({
    secret: 'your-secret-key', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

// MongoDB connection
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/login', auth);
app.use('/api/competition', competition);
app.use('/api/getcompetition', getcompetition);
app.use('/api/teacherupdate', teacherupdate);
app.use('/api/studentupdate', studentupdate);
app.use('/api/getteacher', getteacher);
app.use('/api/getstudent', getstudent);
app.use('/api/updatedCompetition', updatedCompetition);
app.use('/api/deleteCompetition', deleteCompetition);
app.use('/api/liveCompetition', liveCompetition);
app.use('/api/getLiveCompetition', getLiveCompetition);
app.use('/api/liveRound', liveRound);
app.use('/api/submitAnswers', submitAnswer);
app.use('/api/getAnswer', getAnswer);
app.use('/api/getRound', getRound);
app.use('/api/save-result', roundResult);
app.use('/api/checkGrading', checkGrading);
app.use('/api/declaredResults', declaredResult);
app.use('/api/updateAllowance', updateAllowance);
app.use('/api/checkAllowance', checkAllowance);
app.use('/api/assignsWinners', assignWinners);
app.use('/api/getCompetitionByStudentId', getcompetitionByStudentId);
app.use('/api/enroll', enroll);
app.use('/api/disallow', disallow);
app.use('/api/forgotPassword', forgotPassword);
app.use('/api/enrolledStudents', enrolledStudents);
app.use('/api/previousCompetitions', previousCompetitions);
app.use('/api/unLive', unLive);
app.use('/api/UandP', UandP);
//contact form api start 
app.use('/api/helpform', helpForm)
app.use('/api/feedbackform', feedbackForm )
// Serve static files from the uploads folder
app.use('/uploads', express.static('uploads'));
app.use('/uploads2', express.static('uploads2'));



// Default Route
app.get('/', (req, res) => {
    res.send('Server Working');
});

module.exports = app;
