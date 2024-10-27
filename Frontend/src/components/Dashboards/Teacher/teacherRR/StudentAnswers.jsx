import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentAnswers.css';
import { Editor } from '@monaco-editor/react';
import Loader from '../../../../utilities/Loader/Loader';
import { toast } from 'react-toastify';

function StudentAnswers({ answers, roundType, studentName }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [outputs, setOutputs] = useState({}); // To store output for each question by index
  const [loadingIndex, setLoadingIndex] = useState(null); // To track the question being executed
  const [errors, setErrors] = useState({}); // To store error for each question by index
  const [fetchedRounds, setFetchedRounds] = useState({});
  const [results, setResults] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const notifyA = (e) => toast.error(e);
  const notifyB = (e) => toast.success(e);

  // Language mapping for Judge0 API
  const languageMap = {
    python: 71, // Python (3.8.1)
    javascript: 63, // Node.js (12.14.0)
    java: 62, // Java (OpenJDK 13.0.1)
    c: 50, // C (GCC 9.2.0)
    cpp: 54 // C++ (GCC 9.2.0)
  };

  // Function to run the code by sending it to the Judge0 API
  const handleRunCode = async (code, index, language) => {
    if (!language || typeof language !== 'string') {
      setErrors((prevErrors) => ({ ...prevErrors, [index]: 'Language is required or invalid' }));
      return;
    }

    const languageId = languageMap[language.toLowerCase()]; // Safely call toLowerCase()

    if (!languageId) {
      setErrors((prevErrors) => ({ ...prevErrors, [index]: 'Unsupported language' }));
      return;
    }

    setLoadingIndex(index); // Set the loading state for the current question
    setErrors((prevErrors) => ({ ...prevErrors, [index]: null })); // Reset error for the question
    setOutputs((prevOutputs) => ({ ...prevOutputs, [index]: null })); // Reset output for the question

    try {
      // Step 1: Submit the code for execution
      const submissionResponse = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions', // Judge0 API URL
        {
          source_code: code,
          language_id: languageId,
          stdin: '', // Add input here if required
          redirect_stderr_to_stdout: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '08f3d809bcmsh29773666f944421p111ed4jsn544e02320b0a', // Replace with your RapidAPI key
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      const token = submissionResponse.data.token;

      // Step 2: Poll for the result until it's processed
      let resultResponse;
      let status = 2; // Status ID for "Processing"
      while (status === 2 || status === 1) { // 1 = "Queued", 2 = "Processing"
        // Wait 1 second before making the next status request
        await new Promise(resolve => setTimeout(resolve, 1000));

        resultResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': '08f3d809bcmsh29773666f944421p111ed4jsn544e02320b0a', // Replace with your RapidAPI key
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          }
        );

        status = resultResponse.data.status.id;
      }

      // Step 3: Display the result (output or error) for the specific question
      if (resultResponse.data.stdout) {
        setOutputs((prevOutputs) => ({ ...prevOutputs, [index]: resultResponse.data.stdout }));
        setShowLoading(false)
      } else if (resultResponse.data.stderr || resultResponse.data.compile_output) {
        setErrors((prevErrors) => ({ ...prevErrors, [index]: resultResponse.data.stderr || resultResponse.data.compile_output }));
        setShowLoading(false)
      }
    } catch (err) {
      setErrors((prevErrors) => ({ ...prevErrors, [index]: 'Failed to execute code.' }));
      setShowLoading(false)
    } finally {
      setLoadingIndex(null); // Reset the loading state after execution
    }
  };

  useEffect(() => {
    const fetchRound = async () => {
      try {
        setShowLoading(true)
        const response = await fetch(`${apiUrl}/api/getRound/${answers[0].competitionId}/${answers[0].roundId}`);
        const data = await response.json();
        setFetchedRounds(data); // Store fetched Round
        setShowLoading(false)
      } catch (error) {
        setErrors((prevErrors) => ({ ...prevErrors, general: "Error fetching round results" }));
        setShowLoading(false)
      }
    };

    fetchRound();
  }, [answers]);

  // checks submitted answers with correct answers
  // Function to compare answers
  const [checkFlag, setCheckFlag] = useState(false);
  const compareAnswers = (studentAnswers, fetchedRound) => {
    studentAnswers[0].answers.map(studentAnswer => {
      const correctQuestion = fetchedRound.questions.find(q => q.question === studentAnswer.question.trim());
      const result = {
        question: studentAnswer.question,
        studentAnswer: studentAnswer.answer,
        correctAnswer: correctQuestion ? correctQuestion.answer : null,
        isCorrect: correctQuestion ? studentAnswer.answer === correctQuestion.answer : false
      };
      // Use functional form of setState to accumulate results
      setResults(prevResults => [...prevResults, { isCorrect: result.isCorrect }]);
    });
    setCheckFlag(true);
  };

  const [visibility, setVisibility] = useState(answers[0].answers.map(() => ({ correct: true, incorrect: true, isClicked: false })));
  const handleCorrectClick = (index) => {
    setVisibility(
      visibility.map((item, i) =>
        i === index ? { ...item, incorrect: false, isClicked: true } : item
      )
    );
    setResults(prevResults => [...prevResults, { isCorrect: true }]);
    notifyB("Correct Answer Added")
  };

  const handleIncorrectClick = (index) => {
    setVisibility(prevVisibility =>
      prevVisibility.map((item, i) =>
        i === index ? { ...item, correct: false, isClicked: true } : item
      )
    );
    setResults(prevResults => [...prevResults, { isCorrect: false }]);
    notifyA("Wrong Answer Added")
  };

  const updateAllowance = async () => {
    setShowLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/updateAllowance/${answers[0].studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setShowLoading(false)
      } else {
        setShowLoading(true)
      }
    } catch (error) {
      setShowLoading(true)
      console.error('Error updating allowance:', error);
    }
  };

  const [resultAnswer, setResultAnswer] = useState(false);
  const saveRoundResult = async (competitionId, roundId, studentId, result, submissionTime) => {
    if (results.length == 0) {
      notifyA("Check At least one answer");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/save-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competitionId,
          roundId,
          studentId,
          result,
          submissionTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        notifyB('Result saved successfully, Also Student Allowance update based on the Result Marks');
        updateAllowance();
        setResultAnswer(data.data)
      } else {
        notifyA(data.message)
      }
    } catch (error) {
      notifyA(error.message)
    }
  };

  return (
    <div className="student-answers-main">
      {showLoading ? <Loader content={"Loading Competition"}></Loader> : <>
        <h2><span>{studentName}</span>'s Submitted Answers</h2>
        {/* Only show the "Check Answer" button if the roundType is 'MCQ' */}
        {roundType === 'MCQ' && (
          <button onClick={() => compareAnswers(answers, fetchedRounds)}>Check Answer</button>
        )}
        <button onClick={() => saveRoundResult(answers[0].competitionId, answers[0].roundId, answers[0].studentId, results, answers[0].submissionTime)}>{resultAnswer ? "Saved" : "Save Answers"}</button>
        {/* Iterate over each submission */}
        {answers.map((submission, submissionIndex) => (
          <div key={submission._id} className="submission-section">
            <div className="answers-list">
              {/* Iterate over each question-answer pair */}
              {submission.answers.map((item, index) => (
                <div key={item._id} className="answer-card">
                  <div className="question">
                    <strong>Q{index + 1}: {item.question}</strong>
                  </div>
                  <div className="answer">
                    {roundType === 'CODE' && (
                      <>
                        {resultAnswer ? <></> : <>
                          {visibility[index].correct && <button disabled={visibility[index].isClicked} onClick={() => handleCorrectClick(index)} className='correct'><i class="ri-check-line"></i></button>}
                          {visibility[index].incorrect && <button disabled={visibility[index].isClicked} onClick={() => handleIncorrectClick(index)} className='wrong'><i class="ri-close-line"></i></button>}
                        </>}
                      </>

                    )}
                    {roundType === 'CODE' ? (
                      <div className="monaco-editor">
                        <Editor
                          height="300px"
                          language={item.language ? item.language.toLowerCase() : 'javascript'} // Use the language of the specific code
                          theme="vs-dark"
                          value={item.answer}
                          options={{
                            readOnly: true, // Make the editor read-only
                            minimap: { enabled: false }, // Disable the minimap for better readability
                            scrollBeyondLastLine: false,
                            padding: { top: 30 },
                          }}
                        />
                      </div>
                    ) : (
                      <span>A: {item.answer}</span>
                    )}
                  </div>
                  <div className="checked_result">
                    <p>{checkFlag && (results[index].isCorrect ? <i class="ri-checkbox-circle-fill correct"></i> : <i class="ri-close-circle-fill incorrect"></i>)} </p>
                  </div>

                  {/* Show 'Run Code' button only if the roundType is 'CODE' */}
                  {roundType === 'CODE' && (
                    <div className="run-code-section">
                      <button onClick={() => handleRunCode(item.answer, index, item.language)} disabled={loadingIndex === index}>
                        {loadingIndex === index ? 'Running Code...' : 'Run Code'}
                      </button>
                      {outputs[index] && (
                        <div className="output-section">
                          <h5>Output:</h5>
                          <pre>{outputs[index]}</pre>
                        </div>
                      )}
                      {errors[index] && (
                        <div className="error-section">
                          <h5>Error:</h5>
                          <pre>{errors[index]}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </>}
    </div>
  );
}

export default StudentAnswers;
