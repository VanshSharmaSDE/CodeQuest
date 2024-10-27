import React, { useContext, useState } from "react";
import "./AvailableResults.css";
import { toast } from "react-toastify";
import { StudentCompetitionContext } from "../../../../context/S_D3_CompetitionContext";

const AvailableResults = ({ index, closeAvailableRounds }) => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const { 
    submittedCompetitions,
    studentData
  } = useContext(StudentCompetitionContext);
   const notify = (e) => toast.error(e);
  const [participants, setParticipants] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [clickCounter, setClickCounter] = useState(0); 

  const fetchStudentsByRoundID = async (roundId) => {
    try {
      const response = await fetch(`${apiUrl}/api/declaredResults/${roundId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setParticipants(data); 
    } catch (error) {
      notify(`"Error fetching declared results:", ${error}`)
    }
  };

  const getSubmissionTime = (time) => {
    const date = new Date(time);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleButtonClick = (roundId, index) => {
    setActiveIndex(index);
    fetchStudentsByRoundID(roundId, index);
    setClickCounter(1)
  };

  
  return (
    <>
    <div className="results-container">
    <div className="results-header">
      <h1>Results <span>&gt;</span> {submittedCompetitions[index].competitionName}</h1>
      <hr />
    </div>
      <button className="back_to_competition-button" onClick={closeAvailableRounds}>
        <i class="ri-arrow-left-line"></i>
      </button>
      {submittedCompetitions.length !== 0 && submittedCompetitions[index].rounds.map((r, i) => (
        <button
          className={`round_selection_button ${
            activeIndex === i ? "is_selection_active" : ""
          }`}
          onClick={() => handleButtonClick(r._id, i)}
          key={i}
        >
          Round {i + 1}
        </button>
      ))}
      <div className="participants-table">
        <table>
          <thead>
            <tr>
              <th className="participant-small_header">Rank</th>
              <th>Student Name</th>
              <th>Correct Answers</th>
              <th>Submission Time</th>
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <p className={`error_message`}>{
                clickCounter === 0 
                ? "Select a Round"
                : "No Student Data"
              }</p>
            ) : (
              participants.map((student, index) => (
                <tr className={`${student.studentId === studentData.id ? "highlighted_student" : ""}`} key={index}>
                  <td className=" participant-small_header">{index + 1}</td>
                  <td className="">{student.name}</td>
                  <td className="">
                    {student.score}/{student.result.length}
                  </td>
                  <td className="">
                    {getSubmissionTime(student.submissionTime)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AvailableResults;
