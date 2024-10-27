import React, { useContext, useState } from 'react';
import './CreateCompetition.css';
import { CompetitionContext } from '../../../context/T_D2_CompetitionContext';
import Tooltip from '../../../utilities/ToolTip/Tooltip';
import { toast } from 'react-toastify'
import ConfirmPopup from '../../../utilities/Popups/ConfirmPopup';

function CreateCompetition({ onEditCompetition }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      (handleCreateCompetition()); // Call login function on Enter key press
    }
  };

  const notifyA = (e) => toast.error(e)
  const notifyB = (e) => toast.success(e)
  const notifySameName = (e) => toast.error(e)

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmed!');
    setShowConfirmPopup(false);
  };

  const handleCancel = () => {
    console.log('Cancelled');
    setShowConfirmPopup(false);
  };

  const {
    competitions,
    setCompetitions,
    competitionName,
    setCompetitionName,
    setDisableSave

  } = useContext(CompetitionContext);


  const [isModalOpen, setIsModalOpen] = useState(false);
  // const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleCreateCompetition = () => {
  // Check if a competition with the same name already exists
  const competitionExists = competitions.some(c => c.competitionName === competitionName);

  if (competitionExists) {
    // Show an error message or handle the duplicate case
    notifySameName(`${competitionName} already exists. Please choose a different name.`);
    return; // Exit the function to prevent creating a duplicate competition
  }
    const user = JSON.parse(localStorage.getItem('user'));
    const d = new Date();
    const formattedDate = d.toLocaleTimeString() +  " " + d.toDateString(); 
    // let text = d.toISOString();
    if (competitionName.trim()) {
      setCompetitions([...competitions,
         { 
          competitionName: competitionName, 
          creatorId: user.id, 
          rounds: [], 
          id: competitions.length + 1, 
          isLive: false, startTimimg: "", 
          lastSaved: formattedDate, 
         }
        ]);
      setCompetitionName('');
      closeModal();
      setDisableSave(true);
      notifyB(`${competitionName} created Succesfully`)
      
    }
    else{
      notifyA(`You must enter Competition Name`)
    }

  };
  // console.log(competitions);
  
  const handleDeleteCompetition = (index) => {
    setCompetitions(competitions.filter((_, i) => i !== index));
    setShowConfirmPopup(false);
    notifyA(`${competitionName} Deleted Succesfully`)
  }

  return (
    <div className="create-competition">
      {competitions.length === 0 ? (
        <>
          <h2>No competition has been created yet.</h2>
          <h3>
            Create a new competition by clicking the
            <button className="plus-button" onClick={openModal}>+</button>
            button.
          </h3>
        </>
      ) : (
        <>
          <h2>Your Competitions</h2>
          <h3>
            Create a new competition by clicking the
            <button className="plus-button" onClick={openModal}>+</button>
            button.
          </h3>
        </>
      )}

      {/* Modal for creating a new competition */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>&times;</button>
            <h3>Create a New Competition</h3>
            <input
              type="text"
              placeholder="Enter competition name"
              value={competitionName}
              onChange={(e) => setCompetitionName(e.target.value)}
              required = "true"
              autoFocus ="true"
              onKeyDown={handleKeyDown}
            />
            <button className="create-button" onClick={handleCreateCompetition}>Create</button>
          </div>
        </div>
      )}
      <hr />
      {/* Competition list */}
      <div className="competition-list">
        {competitions.map((competition, index) => (
          <div key={index} className="competition-item">
            <h4>{competition.competitionName} <div className="small_text">{competition.lastSaved}</div></h4>
            <div className="competition-button-container">
              <button className="edit-competition-button btn-animation " onClick={() => onEditCompetition(competition.competitionName, index)}><Tooltip text="Create Competition" position={{ top: 20, left: 20 }}><i class="ri-edit-box-line"></i></Tooltip></button>
              <button className=" edit-competition-button delete btn-animation " onClick={() => setShowConfirmPopup(true)}><Tooltip text='Delete Competition' position={{ top: 20, right: 20 }}><i class="ri-delete-bin-line"></i></Tooltip></button>
              {showConfirmPopup && <ConfirmPopup message="Are you sure?" onConfirm={() => handleDeleteCompetition(index)} onCancel={handleCancel} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateCompetition;


