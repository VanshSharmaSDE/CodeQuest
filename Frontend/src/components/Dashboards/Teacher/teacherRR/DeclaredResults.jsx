import React, { useState, useEffect } from 'react';
import './DeclaredResults.css'; // Add professional styling
import Loader from '../../../../utilities/Loader/Loader';
import CompetitionImage from '../../../../assets/CompetitionImage.png';

function DeclaredResults({ teacherId }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [competitions, setCompetitions] = useState([]);  // List of all competitions
  const [selectedCompetitionIndex, setSelectedCompetitionIndex] = useState(null);
  const [rounds, setRounds] = useState([]); // List of rounds
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null);
  const [declaredStudents, setDeclaredStudents] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Fetch live competitions
    const fetchCompetitions = async () => {
      try {
        setShowLoading(true)
        const response = await fetch(`${apiUrl}/api/getLiveCompetition`);
        const data = await response.json();
        setShowLoading(false)
        setCompetitions(data);
      } catch (error) {
        setShowLoading(false)
        console.log('Error fetching competitions:', error);
      }
    };

    fetchCompetitions();
  }, []);

  const handleSelectCompetition = (index) => {
    setSelectedCompetitionIndex(index);
    setRounds(competitions[index].rounds || []);
  };

  const handleSelectRound = async (roundIndex) => {
    setSelectedRoundIndex(roundIndex);
    const roundId = rounds[roundIndex]._id;

    try {
      setShowLoading(true)
      // Fetch declared results for the selected round
      const response = await fetch(`${apiUrl}/api/declaredResults/${roundId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setShowLoading(false)
      setDeclaredStudents(data);  // Sorted students will be sent from the backend
    } catch (error) {
      setShowLoading(false)
      console.log('Error fetching declared results:', error);
    }
  };

  // Back to competition cards (reset selectedCompetitionIndex and selectedRoundIndex)
  const handleBackToCard = () => {
    setSelectedCompetitionIndex(null);
    setSelectedRoundIndex(null);
    setDeclaredStudents([]); // Reset the students data when going back
  };

  // Back to rounds list (reset selectedRoundIndex)
  const handleBackToRound = () => {
    setSelectedRoundIndex(null);
    setDeclaredStudents([]); // Reset the students data when going back to rounds
  };

  return (
    <div className="">
      {showLoading ? <Loader content={"Loading Component"}></Loader> : <>
        {/* Display Competitions */}
        {selectedCompetitionIndex === null ? (
          <div className="competition-cards-container">
            <h2>Select a Competition</h2>
            <hr />
            <div className="competition-cards-container-section">
              {competitions.length > 0 ? (
                competitions.map((competition, index) => (
                  <div className="live-competion-card-result">
                    <div className="live-competion-card-img-result">
                      <img src={CompetitionImage} alt="" />
                    </div>
                    <div className="live-competion-card-content">
                      <h3>{competition.competitionName} </h3>
                      <div className="small_text">Rounds {competition.rounds.length}</div>
                      <p className='small_text'>{competition.lastSaved}</p>
                      <div className="live-competion-card-button">
                        <button onClick={() => handleSelectCompetition(index)}>Check</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="default">No live competitions available.</p>
              )}
            </div>
          </div>
        ) : selectedRoundIndex === null ? (
          <div className="round-buttons">
            <h2>
              <i className="ri-arrow-left-line" onClick={handleBackToCard}></i>{' '}
              {competitions[selectedCompetitionIndex].competitionName} <i className="ri-arrow-right-s-fill"></i> Rounds ☝️
            </h2>
            <hr />
            {rounds.length > 0 ? (
              rounds.map((round, index) => (
                <button key={round._id} onClick={() => handleSelectRound(index)}>
                  {`Round ${index + 1}`}
                </button>
              ))
            ) : (
              <p className='default'>No rounds available.</p>
            )}
          </div>
        ) : (
          <div className="results-section round-buttons">
            <h2><i className="ri-arrow-left-line" onClick={handleBackToRound}></i>{' '}{competitions[selectedCompetitionIndex].competitionName} <i className="ri-arrow-right-s-fill"></i> Round {selectedRoundIndex + 1} <i className="ri-arrow-right-s-fill"></i> Declared Results</h2>
            <hr />
            <ul>
              {declaredStudents.length > 0 ? (
                declaredStudents.map((student, index) => (
                  <li key={student._id}>
                    {index + 1}. {student.name}: {student.score} points ({new Date(student.submissionTime).toLocaleString()})
                  </li>
                ))
              ) : (
                <p className='default'>No results declared yet.</p>
              )}
            </ul>
          </div>
        )}
      </>}
    </div>
  );
}

export default DeclaredResults;
