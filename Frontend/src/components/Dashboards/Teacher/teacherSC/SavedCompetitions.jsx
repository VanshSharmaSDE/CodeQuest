import React, { useState, useContext } from 'react'
import './tSC.css'
import Tooltip from '../../../../utilities/ToolTip/Tooltip';
import { toast } from 'react-toastify'
import ConfirmPopup from '../../../../utilities/Popups/ConfirmPopup';
import { CompetitionContext } from '../../../../context/T_D2_CompetitionContext';

function SavedCompetitions({ onEditCompetition }) {

  const apiUrl = import.meta.env.VITE_API_URL;

  const { savedCompetitions } = useContext(CompetitionContext);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const notifyA = (e) => toast.error(e);
  const notifyB = (e) => toast.success(e);
  const notifyC = (e) => toast.error(e);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);

  const handleCancel = () => {
    setShowConfirmPopup(false);
    setSelectedCompetitionId(null);
  };

  const handleDeleteCompetition = async (_id) => {
    if (!_id) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/deleteCompetition/${_id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const result = await response.json();
        notifyB(`Competition deleted successfully: ${result.deletedCompetition.competitionName}`);
        setShowConfirmPopup(false);
        setSelectedCompetitionId(null);
      } else if (response.status === 404) {
        notifyA('Competition not found');
      } else {
        notifyA('Error deleting competition');
      }
    } catch (error) {
      notifyA('An error occurred while deleting the competition.');
    }
  };

  const handleDeleteClick = (competitionId) => {
    setSelectedCompetitionId(competitionId);
    setShowConfirmPopup(true);
  };

  return (
    <div className="tSc-main">
      <h1>All Saved Competitions</h1>
      <div className="tSC-saved_comp_container">
        {savedCompetitions.length !== 0 ? savedCompetitions.map((competition, compIndex) => (
          <div key={compIndex} className="competition-item">
            <h4>{competition.competitionName} <div className="small_text">{competition.lastSaved}</div> </h4>
            <div className="competition-button-container">
              {!competition.isLive
                ? <button className="edit-competition-button btn-animation editcompi" onClick={() => onEditCompetition(compIndex)}><Tooltip text="Edit Competition" position={{ top: 20, left: 20 }}><i class="ri-edit-box-line"></i></Tooltip></button>
                : <button className="edit-competition-button editcompi-false" onClick={() => notifyC("Cannot edit Live Competition ")}><Tooltip text="Edit Competition" position={{ top: 20, left: 20 }}><i class="ri-edit-box-line"></i></Tooltip></button>
              }
              <button className=" edit-competition-button delete btn-animation " onClick={() => handleDeleteClick(competition._id)}><Tooltip text='Delete Competition' position={{ top: 20, right: 20 }}><i class="ri-delete-bin-line"></i></Tooltip></button>
              {showConfirmPopup && <ConfirmPopup message="Are you sure? To Delete Current Competion" onConfirm={() => handleDeleteCompetition(selectedCompetitionId)} onCancel={handleCancel} />}
            </div>
          </div>
        ))
          : <div className='error_message'>No competition has been saved</div>
        }
      </div>
    </div>
  )
}

export default SavedCompetitions