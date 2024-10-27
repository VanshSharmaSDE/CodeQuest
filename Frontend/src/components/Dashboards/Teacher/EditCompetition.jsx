import React, { useState, useContext } from 'react';
import './EditCompetition.css';
import { useParams } from 'react-router-dom';
import { CompetitionContext } from '../../../context/T_D2_CompetitionContext';
import AddQuestionModal from './AddQuestionModal';
import ShowAnswers from './ShowAnswers';
import { toast } from 'react-toastify'
import ConfirmPopup from '../../../utilities/Popups/ConfirmPopup';
import Loader from '../../../utilities/Loader/Loader';

function EditCompetition({ onBack, compName, index }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [showLoading, setShowLoading] = useState(false)

  const notifyA = (e) => toast.error(e)
  const notifyB = (e) => toast.success(e)

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showConfirmPopup2, setShowConfirmPopup2] = useState(false);

  const handleCancel = () => {
    setShowConfirmPopup(false);
    setShowConfirmPopup2(false);
  };

  const {
    competitions,
    setCompetitions,
    isModalOpen,
    setIsModalOpen,
    isAnswerOpen,
    setisAnswerOpen,
    setDisableSave,
    disableSave
  } = useContext(CompetitionContext);

  //logic of competition
  const handleDeleteCompetition = (index) => {
    setCompetitions(competitions.filter((_, i) => i !== index));
  };

  // to ask timing to live the competition
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const closeLiveModal = () => setIsLiveModalOpen(false);

  const handleLiveSubmit = () => {
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
    closeLiveModal();
  };

  // console.log(competitions[index]);

  const handleSaveCompetition = async (index) => {
    const competition = competitions[index];
    setShowConfirmPopup2(false)

    // check to avoid saving a compeition without any round or empty questions or lamda lassun
    if (competition.rounds.length > 0) {
      const allRoundsHaveQuestions = competition.rounds.every(round => round.questions && round.questions.length > 0);

      if (allRoundsHaveQuestions) {
        setShowLoading(true)
        try {
          const response = await fetch(`${apiUrl}/api/competition`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(competition)
          });

          if (response.ok) {
            const data = await response.json();
            setShowLoading(false)
            localStorage.setItem('CMPT_id', data._id)
            notifyB("Saved! Available in Saved Competition")
          } else {
            const errorData = await response.json();
            setShowLoading(false)
          }
          setShowLoading(false)
          setDisableSave(false);
          handleDeleteCompetition(index);
          onBack()
        } catch (error) {
          notifyA("Some Error Occured");
          setShowLoading(false)
        }
      } else {
        setShowLoading(false)
        notifyA("One or more rounds have no questions.")
      }
    } else {
      setShowLoading(false)
      notifyA("You must have create atleast one Round before Saving the Competition")
    }
  };

  // logic of rounds
  const [temporaryRound, setTemporaryRound] = useState(null); //used for adding question to the particular round
  const [temporaryRoundType, setTemporaryRoundType] = useState(null); //used for adding question to the particular round
  const openModal = () => setIsModalOpen(true);
  // this handles the pop up when round is created
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [roundType, setRoundType] = useState('MCQ');
  const [roundDuration, setRoundDuration] = useState(10);

  const openTypeModal = () => setIsTypeModalOpen(true);

  const closeTypeModal = () => setIsTypeModalOpen(false);

  const submitTypeModal = () => {
    handleCreateRound(compName, roundType, roundDuration);
    setIsTypeModalOpen(false);
  }

  const handleRoundTypeChange = (e) => setRoundType(e.target.value);

  const handleRoundDurationChange = (e) => setRoundDuration(e.target.value);

  const handleCreateRound = (compName, type, duration) => {
    openTypeModal();
    setCompetitions(
      competitions.map(c =>
        c.competitionName === compName
          ? { ...c, rounds: [...c.rounds, { roundNumber: c.rounds.length + 1, roundType: type, roundDuration: duration, isRoundLive: false, questions: [] }] }
          : c
      )
    );
  };

  const handleDeleteRound = (competitionName, roundId) => {
    setCompetitions(
      competitions.map(c =>
        c.competitionName === competitionName
          ? { ...c, rounds: c.rounds.filter(r => r.roundNumber !== roundId).map((r, index) => ({ ...r, roundNumber: index + 1 })) }
          : c
      )
    );
    setShowConfirmPopup(false);
  };

  const handleEditRound = (roundNumber, roundType) => { //it is to be noted that, to edit a round, compNAme, rounTYpe and roundId is required but here only roundid and rounType are given to the function as the compName is directly provided to the AddQustionModal component via useParams hook.
    openModal();
    setTemporaryRound(roundNumber);
    setTemporaryRoundType(roundType);
  };

  // alert when exiting before saving the comp
  const alertSave = () => alert("Save the round before going back")

  // to display answer in pop up
  const [temporaryComp, setTemporaryComp] = useState(null) //gives the comp name to showAnswer.jsx
  const [temporaryRoundId, setTemporaryRoundId] = useState(null) //gives the round index to showAnswer.jsx

  const openAnswer = () => setisAnswerOpen(true);

  const showAnswers = (competitionName, roundId) => {
    setTemporaryComp(competitionName)
    setTemporaryRoundId(roundId)
    openAnswer();
  }

  return (
    <div className="edit-competition">
      {showLoading ? <Loader content={"Wait While Loading! ..."}></Loader> : <>
        <div className="edit-competition-header">
          <button className="back-button" onClick={disableSave ? alertSave : onBack}><i class="ri-arrow-left-line"></i></button>
          <h2>{compName}</h2>
          <div className="edit-competition-header-button">
            <button className="edit-competition-button btn-animation " onClick={openTypeModal}><i class="ri-add-circle-fill"> Rounds</i></button>
            {disableSave
              ? <button className="edit-competition-button btn-animation " onClick={() => setShowConfirmPopup2(true)}><i class="ri-upload-cloud-line"> Save</i></button>
              : <button className="edit-competition-button disabled_button "><i class="ri-upload-cloud-line"> Saved</i></button>
            }
            {showConfirmPopup2 && <ConfirmPopup message="Are you sure?" onConfirm={() => handleSaveCompetition(index)} onCancel={handleCancel} />}
          </div>
        </div>
        <hr />
        <div className="rounds-list">
          {
            competitions.map((competition, compIndex) =>
              competition.competitionName === compName &&
              (competition.rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="round-item">
                  <h4>Round {round.roundNumber} <div className="small_text">{round.roundType}, {round.roundDuration} seconds</div></h4>
                  <div className="competition-button-container">
                    <div>
                      <button className="edit-competition-button btn-animation" onClick={() => handleEditRound(round.roundNumber, round.roundType)}><i class="ri-add-circle-fill"> Questions</i> </button>
                      <button className="edit-competition-button btn-animation" onClick={() => showAnswers(competition.competitionName, round.roundNumber)}><i class="ri-eye-fill"> {round.questions.length}</i></button>
                    </div>
                    <button className="edit-competition-button delete btn-animation" onClick={() => setShowConfirmPopup(true)}><i class="ri-delete-bin-line"></i></button>
                    {showConfirmPopup && <ConfirmPopup message="Are you sure?" onConfirm={() => handleDeleteRound(competition.competitionName, round.roundNumber)} onCancel={handleCancel} />}
                  </div>
                </div>
              ))))}
        </div>

        {isTypeModalOpen && (
          <div className="modal-overlay ">
            <div className="round_modal_content">
              <p className='close-button' onClick={closeTypeModal}> &times;</p>
              <h4 className='round_modal_content-header'>Select Round type :</h4>
              <select value={roundType} onChange={handleRoundTypeChange} >
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
            <AddQuestionModal competitionName={compName} roundNumber={temporaryRound} roundType={temporaryRoundType} />
          </div>
        )}

        {/* Modal to live the competition */}
        {isLiveModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content live_modal">
              <h2>Live Competition</h2>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                <option value="5 minutes">After 5 minutes</option>
                <option value="10 minutes">After 10 minutes</option>
                <option value="30 minutes">After 30 minutes</option>
                <option value="1 hour">After 1 hour</option>
              </select>
              <button className='edit-button' style={{ marginRight: '0px' }} onClick={handleLiveSubmit}>Live</button>
              <button className='close-button' onClick={closeLiveModal}>&times;</button>
            </div>
          </div>
        )}

        {isAnswerOpen && <ShowAnswers competitionName={temporaryComp} roundId={temporaryRoundId} roundType={temporaryRoundType} flag={"edit"} />}
      </>}
    </div>
  );
}

export default EditCompetition;
