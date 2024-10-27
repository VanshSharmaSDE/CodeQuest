import React, { useEffect, useState } from 'react';
import StudentAnswers from './StudentAnswers';
import Loader from '../../../../utilities/Loader/Loader';

function StudentList({ competitionData, roundId, onBack, roundType, roundIndex }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [answers, setAnswers] = useState([]);
  const [studentsInfo, setStudentsInfo] = useState([]);
  const [selectedStudentAnswers, setSelectedStudentAnswers] = useState(null); // To store selected student's answers
  const [showLoading, setShowLoading] = useState(false);
  const [isChecked,setIsChecked] = useState(false)

  // Fetch answers for the selected round
  useEffect(() => {
    const fetchRoundResults = async () => {
      try {
        setShowLoading(true)
        const response = await fetch(`${apiUrl}/api/getAnswer/${roundId}`);
        const data = await response.json();
        setAnswers(data); // Store fetched answers
        setShowLoading(false)
      } catch (error) {
        setShowLoading(false)
      } finally {
        setShowLoading(false)
      }
    };

    fetchRoundResults();
  }, [roundId]);

  // Fetch student details for each answer's studentId
  useEffect(() => {
    const fetchStudentsDetails = async () => {
      if (answers.length > 0) {
        const students = await Promise.all(
          answers.map(async (answer) => {
            try {
              setShowLoading(true)
              const response = await fetch(`${apiUrl}/api/getstudent/${answer.studentId}`);
              const data = await response.json();
              setShowLoading(false)
              return { ...data, answers: answer }; // Attach the answer to the student info
            } catch (error) {
              console.error("Error fetching student details:", error);
              setShowLoading(false)
              return null;
            }
          })
        );
        setStudentsInfo(students.filter(student => student !== null)); // Store only valid student info
      }
    };

    fetchStudentsDetails();
  }, [answers]);  

  const handleCheckResult = (studentId,index) => {
    // Filter the answers for the selected student
    const studentAnswers = answers.filter(answer => answer.studentId === studentId);
    setSelectedStudentAnswers(studentAnswers); // Set selected student's answers
    setStudentIndex(index)
  };

  const handleBackToList = () => {
    setSelectedStudentAnswers(null); // Clear selected answers and go back to the list
    
  };

  const [sudentIndex,setStudentIndex] = useState(0)

  if (!answers.length) {
    return (
      <>
        <div className='default'>No answers found for this round.</div>
        <button onClick={onBack} className='back-button'>
          <i className="ri-arrow-left-line"></i> Back
        </button>
      </>
    )
  }

  return (
    <div className="student-list-main">
      {showLoading ? <Loader content={"Loading Results"}></Loader> : <>
        <h2>
          <i className="ri-arrow-left-line" onClick={onBack}></i> {competitionData.competitionName} <i class="ri-arrow-right-s-fill"></i> Round {roundIndex} <i class="ri-arrow-right-s-fill"></i> All Participated Students
        </h2>
        <hr />

        {/* Conditionally show either the list of students or the selected student's answers */}
        {selectedStudentAnswers ? (
          <div className="student-answers">
            {/* <h3>Submission</h3> */}
            <button onClick={handleBackToList}>
              <i className="ri-arrow-left-line"></i> Back to Students List
            </button>
            {/* Display the selected student's answers */}
            {selectedStudentAnswers.map((answer, index) => (
              <div key={index} className="answer-item">
                <StudentAnswers answers={selectedStudentAnswers} roundType={roundType} studentName={studentsInfo[sudentIndex].name}></StudentAnswers>
              </div>
            ))}
          </div>
        ) : (
          <div className="student-list">
            {studentsInfo.length > 0 ? (
              studentsInfo.map((student, index) => (
                <div key={index} className="student-list-card">
                  <h3>{student.name}</h3>
                  <h5>Results for Round: {roundId}</h5>
                  {answers[index].isChecked?<button disabled>
                    Checked <i className="ri-arrow-right-line"></i>
                  </button>:<button onClick={() => handleCheckResult(student.id,index)}>
                    Check Result <i className="ri-arrow-right-line"></i>
                  </button>}
                </div>
              ))
            ) : (
              <>
                <p>No students have submitted answers for this round.</p>
                <button onClick={onBack}>
                  <i className="ri-arrow-left-line"></i> Back
                </button>
              </>
            )}
          </div>
        )}
      </>}
    </div>
  );
}

export default StudentList;
