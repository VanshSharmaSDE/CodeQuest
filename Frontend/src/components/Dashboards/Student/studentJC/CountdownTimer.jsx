import React, { useState, useEffect } from 'react';
import RoundButton from './DisableRoundButton';

const CountdownTimer = ({ startTiming, competition }) => {
  
  const [isJoinModalActive, setIsJoinModalActive] = useState(false);
  const [availableRounds, setAvailableRounds] = useState(false);
  const [currentCompIndex, setCurrentCompIndex] = useState(0);
  const [compID, setCompID] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [showButton, setShowButton] = useState(false);

  const openJoinModal = (index) => {
    setIsJoinModalActive(true);
    setCurrentCompIndex(index);
  }

  const closeJoinModal = () => setIsJoinModalActive(false);
  const handleCompID = (e) => setCompID(e.target.value);

  const submitCompID = () => {
    competition._id === competition._id ? setAvailableRounds(true) : setAvailableRounds(false)
    setCompID("")
  }

  const targetTime = new Date(startTiming).getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setShowButton(true);
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  function getRoundStartTiming(stringTime) {
    const date = new Date(stringTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    if (hours === "NaN" || minutes === "NaN" || seconds === "NaN") {
      return "";
    }
    return `${hours}:${minutes}:${seconds}`;
  }

  function getRoundEndTiming(stringTime, rIndex) {
    const date = new Date(stringTime);
    const eachRoundDuration = competition.rounds[rIndex].roundDuration * competition.rounds[rIndex].questions.length * 1000;
    const endDate = new Date(date.getTime() + eachRoundDuration);
    const hours = endDate.getHours().toString().padStart(2, '0');
    const minutes = endDate.getMinutes().toString().padStart(2, '0');
    const seconds = endDate.getSeconds().toString().padStart(2, '0');
    if (hours === "NaN" || minutes === "NaN" || seconds === "NaN") {
      return "";
    }
    return `${hours}:${minutes}:${seconds}`;
  }

  function getEndTime(stringTime, rIndex) {
    const date = new Date(stringTime);
    const eachRoundDuration = competition.rounds[rIndex].roundDuration * competition.rounds[rIndex].questions.length * 1000;
    const endDate = new Date(date.getTime() + eachRoundDuration);
    return endDate;
  }

  return (
    <div>
      {showButton ? (
        <button className="enter_to_join" onClick={() => openJoinModal()}>Enter CompID</button>
      ) : (
        <div>
          <p>Time left: {formatTime(timeLeft)}</p>
        </div>
      )}

      {isJoinModalActive
        && <><div className="join_modal-overlay">
          <div className="join_modal-content">
            <div className="join_modal-id">
              <div className="close-join_modal" onClick={closeJoinModal}>&times;</div>
              <h2>{competition.competitionName} </h2>
              <p style={{ color: "#9a342d" }}>The CompID is shared by Competition creator</p>
              <input type="text" placeholder="Enter ID" onChange={handleCompID} value={competition._id} />
              <button onClick={submitCompID}>Enter</button>
            </div>
            <div className="available_rounds">
              <h3>Available Rounds</h3>
              {availableRounds ?
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>ROUNDS</th>
                        <th>START TIME</th>
                        <th>END TIME</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    {competition.rounds.map((round, index) => (
                      <tbody key={index} className="Student_available_rounds-details">
                        <td>Round {round.roundNumber} </td>
                        <td>{getRoundStartTiming(round.roundStartTiming)}</td>
                        <td>{getRoundEndTiming(round.roundStartTiming, index)}</td>
                        {round.isRoundLive
                          ? <td> <RoundButton competition={competition} endTime={getEndTime(round.roundStartTiming, index)} rIndex={index} /> </td>
                          : <td> N/A</td>
                        }
                      </tbody>
                    ))}
                  </table>
                </> : <p className="error_messages">Enter correct ID to display Rounds</p>}
            </div>
          </div>
        </div>
        </>
      }
    </div>


  );
};

export default CountdownTimer;
