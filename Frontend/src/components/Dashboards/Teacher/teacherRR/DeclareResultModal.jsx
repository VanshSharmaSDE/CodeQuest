import React, { useState } from 'react';
import './DeclareResultModal.css'; // CSS file for styling
import Loader from '../../../../utilities/Loader/Loader';

const DeclareResultModal = ({ rounds, onDeclare, onCancel, competitionId }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedRound, setSelectedRound] = useState(null);
  const [isCheckingGrading, setIsCheckingGrading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Handle selecting a round
  const handleSelectRound = (roundId) => {
    setSelectedRound(roundId);
  };

  // Handle declaring result
  const handleDeclareResult = async () => {
    if (!selectedRound) {
      alert('Please select a round before declaring results.');
      return;
    }
    try {
      setIsCheckingGrading(true);
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/checkGrading/${competitionId}/${selectedRound}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.allGraded) {
        setShowLoading(false)
        alert('Not all students have been graded yet. Results cannot be declared.');
      } else {
        setShowLoading(false)
        onDeclare(); // Trigger the result declaration process
        alert('Results declared successfully!');
      }
    } catch (error) {
      console.error('Error declaring result:', error);
      setShowLoading(false)
    } finally {
      setShowLoading(false)
      setIsCheckingGrading(false);
    }
  };

  return (
    <div className="declare-result-popup">
      {showLoading ? <Loader></Loader> : <>
        <div className="popup-content">
          <h2>Select a Round to Declare Result</h2>

          {/* Round selection dropdown */}
          <select onChange={(e) => handleSelectRound(e.target.value)} value={selectedRound || ''}>
            <option value="" disabled>Select a Round</option>
            {rounds.map((round) => (
              <option key={round._id} value={round._id}>
                {`Round ${round.roundNumber}`}
              </option>
            ))}
          </select>

          {/* Conditionally render buttons if a round is selected */}
          {selectedRound && (
            <div className="action-buttons">
              <button className="declare-btn" onClick={handleDeclareResult} disabled={isCheckingGrading}>
                {isCheckingGrading ? 'Checking...' : 'Declare Result'}
              </button>
              <button className="cancel-btn" onClick={onCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </>}
    </div>
  );
};

export default DeclareResultModal;
