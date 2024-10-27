import { createContext, useState } from "react";

export const StudentCompetitionContext = createContext();

const StudentCompetitionContextProvider = (props) => {

  const [competitionData,setCompetitionData] = useState([]);

  const [studentData,setStudentData] = useState({});

  const [submittedCompetitions, setSubmittedCompetitions] = useState([]); //carries data of competition given by student

    const studentContext = {
        competitionData,
        setCompetitionData,
        studentData,
        setStudentData,
        submittedCompetitions, 
        setSubmittedCompetitions
    }

    return (
        <StudentCompetitionContext.Provider value={studentContext}>
            {props.children}
        </StudentCompetitionContext.Provider>
    )
}

export default StudentCompetitionContextProvider;