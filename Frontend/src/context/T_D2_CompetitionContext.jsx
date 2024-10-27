import { createContext, useState } from "react";

export const CompetitionContext = createContext();

const CompetitionContextProvider = (props) => {
    const [theme, setTheme] = useState(null);
    const [competitions, setCompetitions] = useState([]);
    const [competitionName, setCompetitionName] = useState('');

    // saved competitions from database
    const [savedCompetitions, setSavedCompetitions] = useState([]);

    // recently added
    const [questionType, setQuestionType] = useState('text');
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
    const [correctOption, setCorrectOption] = useState('');
    // const [hideQuestions, setHideQuestions] = useState(true); not needed rn

    // disable submit button after clicking
    const [backCounter, setBackCounter] = useState(0);
    const [disableSave, setDisableSave] = useState(false);

    // modal to add questions
    const [isModalOpen, setIsModalOpen] = useState(false);

    // modal to show questions
  const [isAnswerOpen, setisAnswerOpen] = useState(false);

  
    const contextValue = {
        theme,
        setTheme,
        competitions,
        setCompetitions,
        competitionName,
        setCompetitionName,
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
        isModalOpen, 
        setIsModalOpen,
        isAnswerOpen,
        setisAnswerOpen,
        disableSave,
        setDisableSave,
        savedCompetitions, 
        setSavedCompetitions,
        backCounter,
        setBackCounter
    }

    return (
        <CompetitionContext.Provider value={contextValue}>
            {props.children}
        </CompetitionContext.Provider>
    );
};
export default CompetitionContextProvider;