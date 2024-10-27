import React, { useEffect, useState } from 'react'
import './SD.css'

function SD() {

  const apiUrl = import.meta.env.VITE_API_URL;

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user ? user.id : null;
  const [previousCompetitions, setPreviousCompetitions] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  if (!id) {
    alert("User is not logged in");
    return;
  }

  const handlePreviousCompetition = async () => {
    try {
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/previousCompetitions/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        setShowLoading(false)
        setPreviousCompetitions(result.joinedPreviousCompetitions);
      } else {
        setShowLoading(false)
      }
    } catch (error) {
      setShowLoading(false)
    }
  };

  useEffect(() => {
    handlePreviousCompetition();
  }, [])

  return (

    <div className="SD-main">
      <div className="competition-analysis SD-content">
        <h2>Competition Analysis</h2>
        <div className="competitionAnalysis Analysis">
          <p>To be eligible for competition analysis, a minimum participation in [5] competitions is required.</p>
        </div>
      </div>
      <hr />
      <div className="performance-analysis SD-content">
        <h2>Performance Analysis</h2>
        <div className="performanceAnalysis Analysis">
          <p>To be eligible for performance analysis, a minimum participation in [10] competitions is required.</p>
        </div>
      </div>
      <hr />
      <div className="recently-join SD-content">
        <h2>Recently Joined</h2>
        <div className="recentlyJoined">
          <div className="available_competition-details">
            {!showLoading && (
              previousCompetitions.length > 0 ? (
                previousCompetitions.map((competition, index) => (
                  <div key={index} className="available_competition">
                    <div className="available_competition-details">
                      <h3>{competition.competitionName} <p className="small_text">Rounds {competition.rounds.length}</p></h3>
                      <div className="small_text">{competition.lastSaved}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no_competitions-recently">
                  <p>No previous competitions available</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SD