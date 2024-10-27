import React, { useContext, useState } from "react";
import {CompetitionContext} from '../../../context/T_D2_CompetitionContext';
import './AddQuestionModel.css'
import { toast } from "react-toastify";
const AddQuestionModal = ({competitionName, roundNumber, roundType, flag}) => {
    const {
        questionType,
        setQuestionType,
        question,
        setQuestion,
        answer,
        setAnswer,
        mcqOptions,
        setMcqOptions,
        correctOption,
        setCorrectOption,
        competitions, 
        setCompetitions,
        setIsModalOpen,
        savedCompetitions,
        setSavedCompetitions
    } = useContext(CompetitionContext);

  const closeModal = (e) => {
    setIsModalOpen(false)
    e.preventDefault();
    };

      // logic to add questions to the round
  const addQuestionToRound = (competitionName, roundNumber, roundType) => {
    const newQuestion = {
      question,
      answer: roundType === 'TEXT' ? answer : correctOption,
      options: roundType === 'MCQ' ? mcqOptions : [],
    };
    if (flag === "save") {
      setSavedCompetitions(
        savedCompetitions.map(c => 
          c.competitionName === competitionName
          ? {
            ...c,
            rounds: c.rounds.map(r =>
              r.roundNumber === roundNumber
              ? { ...r, questions: [...r.questions, newQuestion] }
              : r
            )
          }
          : c
        )
      );
      notify("Add Question successfully")
    } else { 
      setCompetitions(
        competitions.map(c => 
          c.competitionName === competitionName
          ? {
            ...c,
            rounds: c.rounds.map(r =>
              r.roundNumber === roundNumber
              ? { ...r, questions: [...r.questions, newQuestion] }
              : r
            )
          }
          : c
        )
      );
    }
      // Reset form fields
      setQuestion('');
      setAnswer('');
      setMcqOptions(['', '', '', '']);
      setCorrectOption('');
  };
  
  const handleMcqOptionChange = (index, value) => {
    const newOptions = [...mcqOptions];
    newOptions[index] = value;
    setMcqOptions(newOptions);
};

//this state increase question submission count
const notify = (e) => toast.success(e)
const [questionCount, setQuestionCount] = useState(1);
  const handleQuestionCount = () =>{
  setQuestionCount(questionCount => questionCount +1);
  }

  return (
    <div className="modal-content">
      <form className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addQuestionToRound(competitionName, roundNumber, roundType);
        }}
      >
        <button className="close-button" onClick={closeModal}>&times;</button>

        {roundType === "TEXT" && (
          <div>
            <label>
              Question: {questionCount}
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required="true"
                autoFocus="true"
              />
            </label>
          </div>
        )}

        {roundType === "MCQ" && (
          <div > 
            <label>
              Question: {questionCount}
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required="true"
                autoFocus="true"
              />
            </label>
            {mcqOptions.map((option, index) => (
              <div key={index} className="question-mcq">
                <label>
                  Option {index + 1}:
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleMcqOptionChange(index, e.target.value)
                      
                    }
                    required="true"
                autoFocus="true"
                  />
                </label> <br />
                <label className="question-mcq-label">
                  <input
                    type="radio"
                    name="correctOption"
                    value={option}
                    checked={correctOption === option}
                    onChange={(e) => setCorrectOption(e.target.value)}
                    required="true"
                   autoFocus="true"
                  /> 
                  Correct
                </label>
              </div>
            ))}
          </div>
        )}

        {roundType === "CODE" && (
          <div>
            <label>
              Question : {questionCount}
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{width: '350px', height: '70px', resize: 'none'}}
                required
              />
            </label>
          </div>  
        )}

        <button type="submit" className="AddQuestionBtn" onClick={handleQuestionCount}>Add Question</button>
      </form>
    </div>
  );
};

export default AddQuestionModal;
