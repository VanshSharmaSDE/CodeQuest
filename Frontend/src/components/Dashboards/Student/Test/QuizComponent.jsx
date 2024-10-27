import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuizComponent.css';
import CodeEditor from '../CodeEditor/CodeEditor';
import { StudentCompetitionContext } from '../../../../context/S_D3_CompetitionContext';
import { toast } from 'react-toastify';
import CountdownTimerWarning from './CountDownTimerWarning';
import Loader from '../../../../utilities/Loader/Loader';
import axios from 'axios';


const QuizComponent = ({ competition, currentRoundIndex }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(competition.rounds[currentRoundIndex].roundDuration); // 5 minutes = 300 seconds
  const [answers, setAnswers] = useState([]); // Temporary array to store answers
  const [currentAnswer, setCurrentAnswer] = useState(""); // Store the current question's answer
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState("")
  const navigate = useNavigate();
  const {
    studentData,
    setStudentData
  } = useContext(StudentCompetitionContext);

  // Get the current round and current question
  const currentRound = competition.rounds[currentRoundIndex];
  const currentQuestion = currentRound.questions[currentQuestionIndex];

  const location = useLocation();
  const studentID = studentData.id;
  const studentImage = studentData.image;
  const studentName = studentData.name;

  const [showLoading, setShowLoading] = useState(false);

  const notifyA = (e) => toast.error(e);
  const notifyB = (e) => toast.success(e);

  // Timer logic
  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion(); // Automatically move to the next question when time runs out
    }

    const intervalId = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  // Handle moving to the next question or round
  const handleNextQuestion = () => {
    const updatedAnswers = [
      ...answers,
      { question: currentQuestion.question, answer: currentAnswer || "", language: language }
    ];

    setAnswers(updatedAnswers);

    // Check if it's the last question in the current round
    if (currentQuestionIndex === currentRound.questions.length - 1) {
      handleSubmitAllAnswers(updatedAnswers);
      // Final step: print answers and redirect
    } else {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer(""); // Clear current answer
      setTimer(competition.rounds[currentRoundIndex].roundDuration); // Reset the timer for the next question
      setCurrentAnswer(""); // Clear the answer input
    }
  };

  // Handler for answering questions
  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value); // Update the current answer
  };

  const [editorCode, setEditorCode] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('');

  // Automatically capture code answer from CodeEditor
  const handleCodeChange = (code, language) => {
    setCurrentAnswer(code);
    setEditorCode(code);
    setLanguage(language);
    setEditorLanguage(language);
  };



  // =============================================================================================================================
  const [outputs, setOutputs] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const languageMap = {
    python: 71, // Python (3.8.1)
    javascript: 63, // Node.js (12.14.0)
    java: 62, // Java (OpenJDK 13.0.1)
    c: 50, // C (GCC 9.2.0)
    cpp: 54 // C++ (GCC 9.2.0)
  };
  const handleRunCode = async (code, index, language) => {
    console.log("Enter in handleRunCode");
    console.log(code, index, language);

    if (!language || typeof language !== 'string') {
      setErrors((prevErrors) => ({ ...prevErrors, [index]: 'Language is required or invalid' }));
      return;
    }

    const languageId = languageMap[language.toLowerCase()];

    if (!languageId) {
      setErrors((prevErrors) => ({ ...prevErrors, [index]: 'Unsupported language' }));
      return;
    }

    setLoadingIndex(index);
    setErrors((prevErrors) => ({ ...prevErrors, [index]: null }));
    setOutputs((prevOutputs) => ({ ...prevOutputs, [index]: null }));

    try {
      const submissionResponse = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions', 
        {
          source_code: code,
          language_id: languageId,
          stdin: '', 
          redirect_stderr_to_stdout: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '08f3d809bcmsh29773666f944421p111ed4jsn544e02320b0a',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );
      const token = submissionResponse.data.token;
      let resultResponse;
      let status = 2;
      while (status === 2 || status === 1) { 
        await new Promise(resolve => setTimeout(resolve, 1000));
        resultResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': '08f3d809bcmsh29773666f944421p111ed4jsn544e02320b0a',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          }
        );
        status = resultResponse.data.status.id;
      }
      if (resultResponse.data.stdout) {
        setOutputs((prevOutputs) => ({ ...prevOutputs, [index]: resultResponse.data.stdout }));
      } else if (resultResponse.data.stderr || resultResponse.data.compile_output) {
        setOutputs((prevErrors) => ({ ...prevErrors, [index]: resultResponse.data.stderr || resultResponse.data.compile_output }));
      }
    } catch (err) {
      setOutputs((prevErrors) => ({ ...prevErrors, [index]: 'Failed to execute code.' }));
    } finally {
      setLoadingIndex(null);
    }
  };
  // =============================================================================================================================


  // Conditional rendering based on roundType
  const renderQuestion = () => {
    switch (currentRound.roundType) {
      case 'CODE':
        return (
          <div className="question-container Code-container">
            <div className="question-left code-left">
              <h1>Question :-</h1>
              <p>{currentQuestion.question}</p>
            </div>
            <div className="answer-right code-right">
              <div className="code">
                <CodeEditor onCodeChange={handleCodeChange}
                  defaultCode={currentQuestion.defaultAnswer || '//Select the language'}  // Pass the default code
                />
              </div>
              <div className="run">
                <button className='run-btn' onClick={() => handleRunCode(`${editorCode}`, 0, `${editorLanguage}`)}>{loadingIndex === 0 ? 'Running Code...' : 'Run Code'}</button>
                <div className="code-runner">
                  <p>{outputs[0] && (
                    <div className="output-section">
                      <h5>Output:</h5>
                      <pre>{outputs[0]}</pre>
                    </div>
                  )}
                    {errors[0] && (
                      <div className="error-section">
                        <h5>Error:</h5>
                        <pre>{errors[0]}</pre>
                      </div>
                    )}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'MCQ':
        return (
          <div className="question-container">
            <div className="question-left">
              <h1>Question :-</h1>
              <p>{currentQuestion.question}</p>
            </div>
            <div className="answer-right">
              <h1>Answer :-</h1>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="mcq-option">
                  <span className="mcq-option-text">{option}</span>
                  <input
                    type="radio"
                    name="mcq-option"
                    value={option}
                    onChange={handleAnswerChange}
                    className="mcq-radio"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <p>Unknown round type</p>;
    }
  };

  const updateAllowance = async () => {
    try {
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/disallow/${studentData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setShowLoading(false)
      } else {
        setShowLoading(false)
      }
    } catch (error) {
      setShowLoading(false)
    }
  };

  useEffect(() => {
    updateAllowance();
  }, [])
  

  const handleSubmitAllAnswers = async (finalAnswers) => {
    const submissionTime = new Date().toISOString(); // Capture current timestamp
    const payload = {
      competitionId: competition._id,
      roundId: currentRound._id,
      studentId: studentID, // Assuming you have the studentId available
      answers: finalAnswers, // The answers array you've built
      submissionTime: submissionTime,
      creatorId: competition.creatorId
    };

    try {
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/submitAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setShowLoading(false)
      // Redirect to student dashboard
      window.location.replace('/student-dashboard');
    } catch (error) {
      setShowLoading(false)
      console.error('Error submitting answers:', error);
    }
  };

  // const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Function to disable right-click context menu
    const disableRightClick = (e) => {
      e.preventDefault();
      notifyB('Right-click is disabled');
    };

    // Function to handle keydown events and disable certain shortcuts
    const handleKeyDown = (e) => {
      if (
        e.key === 'F11' ||                       // F11 - Fullscreen Toggle
        e.key === 'F12' ||                       // F12 - DevTools
        e.key === 'F5' ||                        // F5 - Refresh
        e.key === 'Escape' ||                    // Escape - Exit Fullscreen
        (e.ctrlKey && e.key === 'r') ||          // Ctrl+R - Refresh
        (e.ctrlKey && e.key === 'u') ||          // Ctrl+U - View source
        (e.ctrlKey && e.key === 'p') ||          // Ctrl+P - Print
        (e.ctrlKey && e.key === 's') ||          // Ctrl+S - Save page
        (e.ctrlKey && e.key === 'w') ||          // Ctrl+W - Close tab
        (e.ctrlKey && e.key === 'f') ||          // Ctrl+F - Find in page
        (e.ctrlKey && e.key === 't') ||          // Ctrl+T - New tab
        (e.ctrlKey && e.key === 'T') ||          // Ctrl+T - New tab
        (e.ctrlKey && e.key === 'n') ||          // Ctrl+N - New window
        (e.ctrlKey && e.key === 'N') ||          // Ctrl+N - New window
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I - DevTools
        (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C - Inspect
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J - Console
        (e.ctrlKey && e.shiftKey && e.key === 'n') || // Ctrl+Shift+J - Console
        (e.ctrlKey && e.shiftKey && e.key === 'T') || // Ctrl+Shift+J - Console
        (e.ctrlKey && e.shiftKey && e.key === 'N') || // Ctrl+Shift+J - Console
        (e.altKey && e.key === 'Tab') ||         // Alt+Tab - Switch apps (limited control in browser)
        (e.metaKey && e.key === 'Tab') ||        // Cmd+Tab (macOS) - Switch apps
        (e.metaKey && e.key === 'M') ||          // Cmd+M (macOS) - Minimize window
        (e.altKey && e.key === 'F4')             // Alt+F4 - Close window
      ) {
        e.preventDefault();
        notifyB('Shortcut disabled');
      }
    };

    // Disable right-click
    document.addEventListener('contextmenu', disableRightClick);

    // Disable shortcuts, including F11 for full-screen toggle
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      window.removeEventListener('keydown', handleKeyDown);
      // document.removeEventListener('fullscreenchange', handleFullScreenExit);
    };
  }, []);

  // --------------------------------------my test code--------------------//

  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [warningLimit, setWarningLimit] = useState(0);

  useEffect(() => {
    const handleFullScreenExit = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        setShowWarning(true);
        setWarningLimit(limit => limit + 1)
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenExit);

    document.documentElement.requestFullscreen().catch(() => {
      console.log('Full-screen mode is required');
    });

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenExit);
    };
  }, []);

  const enableFullScreen = () => {
    document.documentElement.requestFullscreen().catch(() => {
      console.log('Failed to enter full-screen mode');
    });
    setIsFullScreen(true);
    setShowWarning(false);
  };

  return (
    <div className="quiz-container" style={{ width: '100%', height: '100vh', position: 'absolute', zIndex: 100000 }}>
      {showLoading ? <Loader content={"Processing"}></Loader> : <>
        <div className="GivingComp-navbar">
          <h1>CQ</h1>
          <h2>Competition Name</h2>
          <div className="GivingComp-student-profile">
            <h4>{studentName}</h4>
            <img src={studentImage} alt="" />
          </div>
        </div>
        {renderQuestion()}
        <div className="quiz-bottom">
          <div className="timer">
            <p>Time Remaining: <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span></p>
          </div>
          {currentQuestionIndex === currentRound.questions.length - 1 ? <button className="submit-btn" onClick={handleNextQuestion}>submit All answer</button> : <button className="submit-btn" onClick={handleNextQuestion}>submit</button>}
        </div>
        {showWarning && <CountdownTimerWarning enterFullScreen={enableFullScreen} limit={warningLimit}></CountdownTimerWarning>}
      </>}
    </div>
  );
};

export default QuizComponent;