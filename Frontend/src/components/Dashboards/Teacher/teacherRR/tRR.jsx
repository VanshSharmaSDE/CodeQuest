import React, { useState, useEffect } from 'react';
import './tRR.css';
import StudentList from './studentList';
import DeclareResultPopup from './DeclareResultModal';
import DeclaredResults from './DeclaredResults';
import Loader from '../../../../utilities/Loader/Loader';
import CompetitionImage from '../../../../assets/CompetitionImage.png'

function tRR({ teacherId }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isChecking, setIsChecking] = useState(false);
  const [selectedCompNameIndex, setSelectedCompNameIndex] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [showDeclarePopup, setShowDeclarePopup] = useState(false);
  const [showDeclaredResults, setShowDeclaredResults] = useState(false); // New state for declared results view
  const [showLoading, setShowLoading] = useState(false);

  // Fetching Live Competition data
  useEffect(() => {
    const getData = async () => {
      try {
        setShowLoading(true)
        const user = JSON.parse(localStorage.getItem('user'));
        const loginId = user ? user.id : null;

        if (!loginId) {
          alert('User is not logged in');
          return;
        }
        const response = await fetch(`${apiUrl}/api/getLiveCompetition`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setShowLoading(false)
          setCompetitions(data);
        }
      } catch (error) {
        setShowLoading(false)
      }
      setShowLoading(false)
    };
    getData();
  }, []);

  // Function to switch to Round selection
  const handleCheckCompetition = (index) => {
    setIsChecking(true);
    setSelectedCompNameIndex(index);
    setRounds(competitions[index].rounds || []);
  };

  const handleRoundSelection = (roundIndex) => {
    setSelectedRound(roundIndex);
  };

  const handleBackToCard = () => {
    setIsChecking(false);
    setSelectedRound(null);
  };

  const handleDeclareResult = (index) => {
    setSelectedCompNameIndex(index);
    setShowDeclarePopup(true);
  };

  const handleClosePopup = () => {
    setShowDeclarePopup(false);
  };

  // Function to toggle between "Check & Declare Results" and "Declared Results"
  const handleToggleView = (view) => {
    if (view === 'declared') {
      setShowDeclaredResults(true);
    } else {
      setShowDeclaredResults(false);
    }
  };

  return (
    <div className="tRR-main">
      {showLoading ? <Loader content={"Loading Results ..."}></Loader> : <>
        {/* Navbar/Slider for switching views */}
        <div className="navbar">
          <button
            className={!showDeclaredResults ? 'active' : ''}
            onClick={() => handleToggleView('check')}
          >
            Check & Declare
          </button>
          <button
            className={showDeclaredResults ? 'active' : ''}
            onClick={() => handleToggleView('declared')}
          >
            Declared Results
          </button>
        </div>

        {/* Conditionally render content based on the selected view */}
        {!showDeclaredResults ? (
          !isChecking ? (
            <div className="competition-cards-container">
              <h2>All Submitted Competitions</h2>
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
                          <button onClick={() => handleCheckCompetition(index)}>Check</button>
                          <button onClick={() => handleDeclareResult(index)}>Declare</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="default">No live competitions available.</p>
                )}
              </div>
            </div>
          ) : selectedRound === null ? (
            <div className="round-buttons">
              <h2>
                <i className="ri-arrow-left-line" onClick={handleBackToCard}></i>{' '}
                {competitions[selectedCompNameIndex].competitionName} <i className="ri-arrow-right-s-fill"></i> Rounds ☝️
              </h2>
              <hr />
              {rounds.length > 0 ? (
                rounds.map((round, index) => (
                  <button key={round._id} onClick={() => handleRoundSelection(index)}>
                    {`Round ${index + 1}`}
                  </button>
                ))
              ) : (
                <p>No rounds available.</p>
              )}
            </div>
          ) : (
            <StudentList
              competitionData={competitions[selectedCompNameIndex]}
              roundId={rounds[selectedRound]._id}
              onBack={() => setSelectedRound(null)}
              roundType={rounds[selectedRound].roundType}
              roundIndex={rounds[selectedRound].roundNumber}
            />
          )
        ) : (
          <DeclaredResults teacherId={teacherId} /> // Render Declared Results component
        )}

        {/* Declare Result Popup */}
        {showDeclarePopup && (
          <DeclareResultPopup
            rounds={competitions[selectedCompNameIndex].rounds}
            onDeclare={() => {
              handleClosePopup();
            }}
            onCancel={handleClosePopup}
            competitionId={competitions[selectedCompNameIndex]._id}
          />
        )}
      </>}
    </div>
  );
}

export default tRR;
