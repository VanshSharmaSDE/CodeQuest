import React, { useState, useEffect, useContext } from "react";
import QuizComponent from "../Test/QuizComponent";
import { StudentCompetitionContext } from "../../../../context/S_D3_CompetitionContext";
import { toast } from "react-toastify";
import Loader from "../../../../utilities/Loader/Loader";

const RoundButton = ({ endTime, rIndex, competition }) => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [isDisabled, setIsDisabled] = useState(false);
  const { studentData } = useContext(StudentCompetitionContext);
  const [showLoading, setShowLoading] = useState(false);
  const [givingCompiModal, setGivingCompiModal] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [competitionId, setCompetitionId] = useState('');
  const [enrolledData, setEnrolledData] = useState({})
  const notifyA = (e) => toast.error(e);
  const notifyB = (e) => toast.success(e);


  useEffect(() => {
    const checkTime = () => {
      const currentTime = new Date().getTime();
      if (currentTime >= new Date(endTime).getTime()) {
        setIsDisabled(true);
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 1000); 
    return () => clearInterval(interval);
  }, [endTime]);


  const checkAllowance = async () => {
    try {
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/checkAllowance/${studentData.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setShowLoading(false)
      if (data.allowed) {
        setShowLoading(false)
        setGivingCompiModal(true); 
      } else {
        setShowLoading(false)
        notifyA(data.message); 
      }
    } catch (error) {
      setShowLoading(false)
      notifyA('Error checking allowance:', error);
    }
  };

  const enrollStudent = async () => {
    try {
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: studentData.id,
          competitionId: competition._id
        })
      });

      if (!response.ok) {
        setShowLoading(false)
        throw new Error('Failed to enroll student');
      }
      const data = await response.json();
      setShowLoading(false)
      checkAllowance();
      setEnrolledData(data)
    } catch (error) {
      setShowLoading(false)
    }
  };

  const openGivingCompiModal = () => {
    enrollStudent();
  };


  return (
    <>
      {showLoading ? <Loader content={"Wait Checking Aloowance and Loading Competition"}></Loader> : <>
        <button disabled={isDisabled} onClick={() => openGivingCompiModal()}>
          {isDisabled ? "Expired" : "Join"}
        </button>
        {givingCompiModal && <QuizComponent competition={competition} currentRoundIndex={rIndex} />}
      </>}
    </>
  );
};

export default RoundButton;
