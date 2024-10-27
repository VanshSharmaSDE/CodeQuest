import "./sJC.css";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import CountdownTimer from "./CountdownTimer";
import { StudentCompetitionContext } from "../../../../context/S_D3_CompetitionContext";
import Loader from "../../../../utilities/Loader/Loader";

function sJC() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {
    competitionData,
    setCompetitionData,
    studentData
  } = useContext(StudentCompetitionContext);

  const [message, setMessage] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  // to toggle between joining the competitions and past competitions
  const [activeButton, setActiveButton] = useState("button1");
  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  // Fetch competition data using fetch
  const fetchCompetitions = async () => {
    try {
      setShowLoading(true)
        const response = await fetch(
          `${apiUrl}/api/getLiveCompetition`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setShowLoading(false)
          setCompetitionData(data); // Set the competition data in state
        } else {
          // Handle the case where the response status is not 200-299
          const errorData = await response.json();
          setShowLoading(false)
        }
      } catch (error) {
        // Handle fetch error (e.g., network failure)
        setShowLoading(false)
      } finally {
        setShowLoading(false)
      }
    };

    useEffect(() => {
    
    const checkAllowance = async () => {
      try {
        setShowLoading(true)
        const response = await fetch(`${apiUrl}/api/checkAllowance/${studentData.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setShowLoading(false)
          setMessage(data.message);  // Show success message
        } else {
          setShowLoading(false)
        }
      } catch (error) {
        setShowLoading(false)
      }
    };

    // checkAllowance();
    fetchCompetitions();
    handlePreviousCompetition()
  }, []);

  const [previousCompetitions, setPreviousCompetitions] = useState([]);
  // handlePreviousCompetition function to call the backend API and fetch previous competitions
  const handlePreviousCompetition = async () => {
    try {
      setShowLoading(true)
      // Send a GET request to the backend to fetch the student's previous competitions
      const response = await fetch(`${apiUrl}/api/previousCompetitions/${studentData.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Parse the response data
      const result = await response.json();

      if (response.ok) {
        setShowLoading(false)
        // Successfully fetched data
        setPreviousCompetitions(result.joinedPreviousCompetitions)
        // console.log('Total Previous Competitions Count:', result.previousCompetitionCount);

        // Handle the results, e.g., update the UI or state with the fetched data
        // Example: setting the data in component state
        // setJoinedCompetitions(result.joinedPreviousCompetitions);
        // setCompetitionCount(result.previousCompetitionCount);
      } else {
        setShowLoading(false)
        // Handle errors returned by the API
        // console.error('Error:', result.error);
      }
    } catch (error) {
      setShowLoading(false)
      // console.error('Error fetching previous competitions:', error);
      // Handle any errors that occurred during the fetch request
    }
  };


  return (
    <div className="sJC-main">
      <div className="sJC-content">
        {showLoading ? <Loader content={"Processing"}></Loader> : <>
          <div className="sJC-content-buttons">
            <button
              className={`sJC-button ${activeButton === "button1" && "isActive"}`}
              onClick={() => handleButtonClick("button1")}
            >
              Available
            </button>
            <button
              className={`sJC-button ${activeButton === "button2" && "isActive"}`}
              onClick={() => handleButtonClick("button2")}
            > Previously Joined
            </button>
            <div onClick={fetchCompetitions} className={`try_again_button`}>
                <i class="ri-restart-line"></i>
              </div>
          </div>

          {activeButton === "button1" && (
            <div className="LJC">
              <p>
                You can join any live competition by just entering its Comp ID 😉
              </p>
              {!showLoading && (
                competitionData.length > 0 ? (
                  competitionData.map((competition, index) => (
                    <div key={index} className="available_competition">
                      <div className="available_competition-details">
                        <h3>{competition.competitionName} <p className="small_text">Rounds {competition.rounds.length}</p></h3>
                        <div className="small_text">{competition.lastSaved}</div>
                      </div>
                      {/* <p>{competitionData[index].startTiming}</p> */}
                      <CountdownTimer startTiming={competitionData[index].startTiming} competition={competition}></CountdownTimer>
                    </div>
                  ))
                ) : (
                  <div className="no_competitions">
                    <p>No Live competitions available</p>
                  </div>
                )
              )}
            </div>
          )}

          {activeButton === "button2" && (
            <div className="LJC">
              <div className="available_competition-details">
                {!showLoading && (
                  previousCompetitions.length > 0 ? (
                    previousCompetitions.map((competition, index) => (
                      <div key={index} className="available_competition">
                        <div className="available_competition-details">
                          <h3>{competition.competitionName} <p className="small_text">Rounds {competition.rounds.length}</p></h3>
                          <div className="small_text">{competition.lastSaved}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no_competitions">
                      <p>No previous competitions available</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

export default sJC;
