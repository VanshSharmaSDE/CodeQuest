import React, { useContext, useState } from "react";
import "./ShowAnswer.css";
import { CompetitionContext } from "../../../context/T_D2_CompetitionContext";
import { useEffect } from "react";
const ShowAnswers = ({ competitionName, roundId, flag }) => {
  const {
    competitions,
    setCompetitions,
    setisAnswerOpen,
    savedCompetitions,
    setSavedCompetitions,
    setBackCounter
  } =
    useContext(CompetitionContext);

  const [save_OR_edit, setSave_OR_edit] = useState(competitions);

  useEffect(() => {
    if (flag === "edit") {
      setSave_OR_edit(competitions);
    } else {
      setSave_OR_edit(savedCompetitions);
    }
  }, []);
  const closeAnswer = () => setisAnswerOpen(false);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleCancel = () => {
    console.log("Cancelled");
    setShowConfirmPopup(false);
  };

  const deleteQuestionFromRound = (competitionName, roundNumber, questionIndex) => {
    if (flag === "edit") {
      setCompetitions(
        competitions.map(c =>
          c.competitionName === competitionName
            ? {
              ...c,
              rounds: c.rounds.map(r =>
                r.roundNumber === roundNumber
                  ? {
                    ...r,
                    questions: r.questions.filter((_, index) => index !== questionIndex)
                  }
                  : r
              )
            }
            : c
        )
      );
    } else if (flag === "save") {
      // If you also need to handle saved competitions
      setSavedCompetitions(
        savedCompetitions.map(c =>
          c.competitionName === competitionName
            ? {
              ...c,
              rounds: c.rounds.map(r =>
                r.roundNumber === roundNumber
                  ? {
                    ...r,
                    questions: r.questions.filter((_, index) => index !== questionIndex)
                  }
                  : r
              )
            }
            : c
        )
      );
    }
    closeAnswer();
    setBackCounter(1)
  };


  return (
    <>
      <div className="show_answers-overlay">
        <div className="show_answers-container">
          <h1>Round {roundId} Preview</h1>
          <button className="close-button" onClick={closeAnswer}>
            &times;
          </button>
          {save_OR_edit.map(
            (comp) =>
              comp.competitionName === competitionName &&
              comp.rounds.map(
                (round) =>
                  round.roundNumber === roundId &&
                  round.questions.map((q, qIndex) => (
                    <div key={qIndex} className="show_answer">
                      <div>
                        <p> Question {qIndex + 1} : {" "}
                          <strong>
                            {q.question}{" "}
                          </strong>{" "}
                        </p>

                        {round.roundType === "MCQ" && (
                          <div className="created_questions-options">
                            <p>
                              <strong>Options:</strong>
                            </p>
                            <div style={{ padding: "1px 20px" }}>
                              <ul>
                                {q.options.map((option, idx) => (
                                  <li key={idx}>{option}</li>
                                ))}
                              </ul>
                            </div>
                            <p>
                              <strong>Correct Option:</strong> {q.answer}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="delete-button-parent">
                        <button className="edit-competition-button delete btn-animation" onClick={() => deleteQuestionFromRound(competitionName, roundId, qIndex)} > <i class="ri-delete-bin-line"></i> </button>
                        {/* {showConfirmPopup && (
                          <ConfirmPopup message="Are you sure?" onConfirm={() => } onCancel={handleCancel} />
                        )} */}
                      </div>
                    </div>
                  ))
              )
          )}
        </div>
      </div>
    </>
  );
};

export default ShowAnswers;