import React, { useState, useContext } from 'react'
import ConfirmPopup from '../../../../utilities/Popups/ConfirmPopup';
import AddQuestionModal from '../AddQuestionModal';
import ShowAnswers from '../ShowAnswers'
import { CompetitionContext } from '../../../../context/T_D2_CompetitionContext';
import { toast } from 'react-toastify'
import Loader from '../../../../utilities/Loader/Loader';

const EditSavedCompetitions = ({ onBack, index }) => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    isModalOpen,
    setIsModalOpen,
    savedCompetitions,
    setSavedCompetitions,
    isAnswerOpen,
    setisAnswerOpen,
    setDisableSave,
    disableSave,
    backCounter,
    setBackCounter
  } = useContext(CompetitionContext);
  const [temporaryRound, setTemporaryRound] = useState(null);
  const [temporaryRoundType, setTemporaryRoundType] = useState(null);
  const openModal = () => setIsModalOpen(true);
  const [showLoading, setShowLoading] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [roundType, setRoundType] = useState('MCQ');
  const [roundDuration, setRoundDuration] = useState(10);
  const [selectedCompetitionIndex, setSelectedCompetitionIndex] = useState(null);
  const [selectedRoundNumber, setSelectedRoundNumber] = useState(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [temporaryComp, setTemporaryComp] = useState(null);
  const [temporaryRoundId, setTemporaryRoundId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showConfirmPopup2, setShowConfirmPopup2] = useState(false);

  const openTypeModal = () => setIsTypeModalOpen(true);
  const closeTypeModal = () => setIsTypeModalOpen(false);

  const submitTypeModal = () => {
    handleCreateRound(index, roundType, roundDuration);
    setIsTypeModalOpen(false);
  }

  const handleRoundTypeChange = (e) => setRoundType(e.target.value);
  const handleRoundDurationChange = (e) => setRoundDuration(e.target.value);

  const handleCreateRound = (index, type, duration) => {
    openTypeModal();
    setSavedCompetitions(
      savedCompetitions.map((c, i) =>
        i === index
          ? { ...c, rounds: [...c.rounds, { roundNumber: c.rounds.length + 1, roundType: type, roundDuration: duration, isRoundLive: false, questions: [] }] }
          : c
      )
    );
    setBackCounter(1)
  };

  const handleSaveCompetition = async (index) => {
    setShowConfirmPopup2(false);
    const competition = savedCompetitions[index];
    if (competition.rounds.length > 0) {
      const allRoundsHaveQuestions = competition.rounds.every(round => round.questions && round.questions.length > 0);
      if (allRoundsHaveQuestions) {
        const CMPT_id = localStorage.getItem('CMPT_id');
        try {
          const response = await fetch(`${apiUrl}/api/updatedCompetition/${CMPT_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(savedCompetitions[index])
          });

          if (response.ok) {
            const data = await response.json();
          } else {
            const errorData = await response.json();
          }
          setDisableSave(false);
        } catch (error) {
        }
      } else {
        console.log("One or more rounds have no questions.");
        notifyA("One or more rounds have no questions.")
      }
    } else {
      console.log("Round length is 0.");
      notifyA("You must have create atleast one Round before Saving the Competition")
    }
    setBackCounter(0)
  }

  const handleDeleteRound = (competitionName, roundId) => {
    setSavedCompetitions(
      savedCompetitions.map(c =>
        c.competitionName === competitionName
          ? { ...c, rounds: c.rounds.filter(r => r.roundNumber !== roundId).map((r, index) => ({ ...r, roundNumber: index + 1 })) }
          : c
      )
    );
    setShowConfirmPopup(false);
  };

  const handleDeleteClick = (competitionIndex, roundNumber) => {
    setSelectedCompetitionIndex(competitionIndex);
    setSelectedRoundNumber(roundNumber);
    setShowConfirmPopup(true);
  };

  const handleEditRound = (roundNumber, roundType) => {
    openModal();
    setTemporaryRound(roundNumber);
    setTemporaryRoundType(roundType);
    setBackCounter(1)
  };

  const openLiveModal = () => setIsLiveModalOpen(true);
  const closeLiveModal = () => setIsLiveModalOpen(false);

  const handleLiveCompetition = async () => {
    const currentTime = new Date();
    let liveTime;
    switch (selectedTime) {
      case '5 minutes':
        liveTime = new Date(currentTime.getTime() + 5 * 60000);
        break;
      case '10 minutes':
        liveTime = new Date(currentTime.getTime() + 10 * 60000);
        break;
      case '30 minutes':
        liveTime = new Date(currentTime.getTime() + 30 * 60000);
        break;
      case '1 hour':
        liveTime = new Date(currentTime.getTime() + 60 * 60000);
        break;
      default:
        liveTime = currentTime;
    }
    const isLive = true;
    const startTiming = String(liveTime);
    const CMPT_id = savedCompetitions[index]._id;
    if (!isLive || !startTiming) {
      return;
    }
    const data = { isLive, startTiming };
    try {
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/liveCompetition/${CMPT_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setShowLoading(false)
        closeLiveModal();
        notifyB(`Competition updated successfully: ${result.competitionName}`);
      } else if (response.status === 404) {
        setShowLoading(false)
        notifyA('Competition not found');
      } else {
        setShowLoading(false)
        notifyA('Error updating competition');
      }
    } catch (error) {
      setShowLoading(false)
      notifyA('An error occurred while updating the competition.');
    }
    setSavedCompetitions(
      savedCompetitions.map((c, i) => (
        i === index
          ? { ...c, isLive: true }
          : c
      ))
    )
    onBack();
  };

  const alertSave = () => alert("Save the round before going back")
  const openAnswer = () => setisAnswerOpen(true);

  const showAnswers = (competitionName, roundId) => {
    setTemporaryComp(competitionName)
    setTemporaryRoundId(roundId)
    openAnswer();
  }

  const notifyA = (e) => toast.error(e)
  const notifyB = (e) => toast.success(e)

  const handleCancel = () => {
    setShowConfirmPopup(false);
    setShowConfirmPopup2(false)
  };


  return (
    <div>
      {showLoading ? <Loader content={"Saving Changes ..."}></Loader> : <>
        <div className="edit-competition-header">
          <button className="back-button" onClick={backCounter === 0 ? onBack : alertSave}><i class="ri-arrow-left-line"></i></button>
          <h2>{savedCompetitions[index].competitionName} <div className="small_text">{savedCompetitions[index].lastSaved}</div> </h2>
          <div className="edit-competition-header-button">
            <button className="edit-competition-button btn-animation " onClick={openTypeModal}><i class="ri-add-circle-fill"> Rounds</i></button>
            {backCounter === 0
              ? <button className="edit-competition-button disabled_button "><i class="ri-upload-cloud-line"> Saved</i></button>
              : <button className="edit-competition-button btn-animation " onClick={() => setShowConfirmPopup2(true)}><i class="ri-upload-cloud-line"> Save</i></button>
            }

            {showConfirmPopup2 && <ConfirmPopup message="Are you sure?" onConfirm={() => handleSaveCompetition(index)} onCancel={handleCancel} />}
            {backCounter === 0
              ? <button className="edit-competition-button btn-animation " onClick={() => openLiveModal()}><i class="ri-radio-button-line"> Live</i></button>
              : <button className="edit-competition-button disabled_button"><i class="ri-radio-button-line"> Live</i></button>
            }
          </div>
        </div>
        <hr />
        <div className="rounds-list">
          {
            savedCompetitions[index].rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="round-item">
                <h4>Round {round.roundNumber} <div className="small_text">{round.roundType}, {round.roundDuration} seconds</div></h4>
                <div className="competition-button-container">
                  <div>
                    <button className="edit-competition-button btn-animation" onClick={() => handleEditRound(round.roundNumber, round.roundType)}><i class="ri-add-circle-fill"> Questions</i> </button>
                    <button className="edit-competition-button btn-animation" onClick={() => showAnswers(savedCompetitions[index].competitionName, round.roundNumber)}><i class="ri-eye-fill"> {round.questions.length}</i></button>
                  </div>
                  <button className="edit-competition-button delete btn-animation" onClick={() => handleDeleteClick(index, round.roundNumber)}><i class="ri-delete-bin-line"></i></button>
                  {showConfirmPopup && (
                    <ConfirmPopup
                      message="Are you sure?"
                      onConfirm={() => handleDeleteRound(
                        savedCompetitions[selectedCompetitionIndex].competitionName, selectedRoundNumber)}
                      onCancel={() => handleCancel}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>

        {isTypeModalOpen && (
          <div className="modal-overlay ">
            <div className="round_modal_content">
              <p className='close-button' onClick={closeTypeModal}> &times;</p>
              <h4 className='round_modal_content-header'>Select Round type :</h4>
              <select value={roundType} onChange={handleRoundTypeChange} >
                <option value="TEXT">Text : Round with Text questions only</option>
                <option value="MCQ">MCQ : Round with MCQ questions only</option>
                <option value="CODE">Code : Round with Code questions only</option>
              </select>
              <h4 className='round_modal_content-header'> Select duration of each question in this Round :</h4>
              <select value={roundDuration} onChange={handleRoundDurationChange}>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds or 1 minute</option>
                <option value={300}>300 seconds or 5 minutes</option>
                <option value={600}>600 seconds or 10 minutes</option>
                <option value={1800}>1800 seconds or 30 minutes</option>
                <option value={3600}>3600 seconds or 1 hour</option>
              </select>
              <button className="round_modal_content-submit_button" onClick={submitTypeModal}>OK</button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <AddQuestionModal competitionName={savedCompetitions[index].competitionName} roundNumber={temporaryRound} roundType={temporaryRoundType} flag={"save"} />
          </div>
        )}

        {isLiveModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content live_modal">
              <h2>Live Competition</h2>
              <p style={{ color: "red", margin: "5px 0px", fontSize: "smaller" }}>Note : You will not be able to edit this competition in future once it is Live</p>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                <option value="5 minutes">Immediately</option>
                <option value="10 minutes">After 10 minutes</option>
                <option value="30 minutes">After 30 minutes</option>
                <option value="1 hour">After 1 hour</option>
              </select>
              <button className='edit-button' style={{ marginRight: '0px' }} onClick={() => handleLiveCompetition(index)}>Live</button>
              <button className='close-button' onClick={closeLiveModal}>&times;</button>
            </div>
          </div>
        )}

        {isAnswerOpen && <ShowAnswers competitionName={temporaryComp} roundId={temporaryRoundId} roundType={temporaryRoundType} flag={"save"} />}
      </>}
    </div>
  )
}

export default EditSavedCompetitions