import React, { useContext, useEffect, useState } from 'react'
import { StudentCompetitionContext } from '../../../../context/S_D3_CompetitionContext';
import './sCR.css'
import AvailableResults from './AvailableResults';

function sCR({ studentId }) {
   const apiUrl = import.meta.env.VITE_API_URL;

   const {
      submittedCompetitions,
      setSubmittedCompetitions
   } = useContext(StudentCompetitionContext)

   const fetchCompetitions = async (studentId) => {
      const response = await fetch(`${apiUrl}/api/getCompetitionByStudentId/${studentId}`);
      const data = await response.json();
      setSubmittedCompetitions(data.competitions)
   };

   useEffect(() => {
      fetchCompetitions(studentId)
      // console.log(submittedCompetitions);
   }, [])

   const [openRounds, setOpenRounds] = useState(false);
   const [temporaryIndex, setTemporaryIndex] = useState(null)

   const openAvailableResults = (index) => {
      setOpenRounds(true);
      setTemporaryIndex(index);
   }

   const closeAvailableRounds = () => setOpenRounds(false)
   return (
      <>
         {!openRounds &&
            <div className="sCR-main">
               <div className="results-header">
                  <h1>Results </h1>
                  <hr />
               </div>
               <div className="sRC-content">
                  {submittedCompetitions.length !== 0 ? submittedCompetitions.map((c, i) => (
                     <div key={i} className="result">
                        <h4>{c.competitionName}</h4>
                        <h4>{c.lastSaved}</h4>
                        <button onClick={() => openAvailableResults(i)}>Check Result</button>
                     </div>
                  ))
                     : <p className='default'>No Competition Found
                     </p>
                  }
               </div>
            </div>
         }
         {openRounds && <AvailableResults closeAvailableRounds={closeAvailableRounds} index={temporaryIndex}></AvailableResults>}
      </>

   )
}

export default sCR