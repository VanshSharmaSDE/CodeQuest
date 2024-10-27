import React, { useEffect, useState } from 'react';
import './tHome.css';
import Todo from '../../../../utilities/Todo/Todo';
import { toast } from 'react-toastify';
import CompetitionImage from '../../../../assets/CompetitionImage.png';
import Loader from '../../../../utilities/Loader/Loader';

function tHome() {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [competiondata, setCompetitionData] = useState([]);
  const [competiondata2, setCompetitionData2] = useState([]);
  const [isJoinModalActive, setIsJoinModalActive] = useState(false);
  const [showLoading, setShowLoading] = useState(false)

  const closeJoinModal = () => setIsJoinModalActive(false);
  const openJoinModal = (cIndex) => {
    setIsJoinModalActive(true);
    setTemporaryRoundIndex(cIndex)
  }
  const [temporaryRoundIndex, setTemporaryRoundIndex] = useState(0)
  // const [availableRounds, setAvailableRounds] = useState(false);

  const notifyClipboard = (e) => toast.success(e);
  const notifyA = (e) => toast.success(e);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      notifyClipboard(`${text} copied!`);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };


  const getData = async () => {
    setShowLoading(true)
    try {

      // Assuming loginId is stored in localStorage as user.id
      const user = JSON.parse(localStorage.getItem('user'));
      const loginId = user ? user.id : null;

      if (!loginId) {
        alert("User is not logged in");
        return;
      }
      const response = await fetch(
        `${apiUrl}/api/getLiveCompetition/${loginId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompetitionData(data)
        setShowLoading(false)
      } else {
        // Handle the case where the response status is not 200-299
        setShowLoading(false)
        const errorData = await response.json();
      }
    } catch (error) {
      setShowLoading(false)
    }
  }

  useEffect(() => {
    getData();
  }, [])

  const handleLiveRound = async (id1, id2, check) => {
    let checked = !check;
    try {

      setShowLoading(true)
      // Assuming loginId is stored in localStorage as user.id
      const user = JSON.parse(localStorage.getItem('user'));
      const loginId = user ? user.id : null;

      if (!loginId) {
        alert("User is not logged in");
        return;
      }
      const roundStartTiming = new Date
      const response = await fetch(
        `${apiUrl}/api/liveRound/${id1}/${id2}/${checked}/${roundStartTiming}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShowLoading(false)
        notifyA('Current Round is Live Now!');
        RefreshPage();
      } else {
        // Handle the case where the response status is not 200-299
        const errorData = await response.json();
        setShowLoading(false)
      }
    } catch (error) {
      setShowLoading(false)
    }
  }

  const RefreshPage = () => {
    window.location.reload(); // This reloads the page
  };

  // to toggle between joining the competitions and past competitions
  const [activeButton, setActiveButton] = useState("button1");
  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);

  const handleShowStudents = (competitionId) => {
    fetch(`${apiUrl}/api/enrolledStudents/${competitionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setSelectedCompetition(competitionId);
        setShowStudents(true);
      })
      .catch((err) => console.error('Error fetching students:', err));
  };

  // Function to handle going back to the competition cards
  const handleBack = () => {
    setSelectedCompetition(null); // Go back to competition cards
    setStudents([]); // Clear the student list
  };

  const updateAllowance = async (id) => {
    try {
      setShowLoading(true)
      const response = await fetch(`${apiUrl}/api/disallow/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setShowLoading(false)
        notifyA("Student Allowance Updated sucessfully ! Please Referesh the Page to see Changes")
        handleShowStudents(setCompetitionData._id);
      } else {
        setShowLoading(false)
      }
    } catch (error) {
      setShowLoading(false)
    }
  };

  // handleUnlive function to call the end-competition API
  const handleUnlive = async (competitionId) => {
    try {
      setShowLoading(true)
      // Send a PUT request to the backend to mark the competition as no longer live
      const response = await fetch(`${apiUrl}/api/unLive/${competitionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
      const result = await response.json();
      if (response.ok) {
        setShowLoading(false)
        notifyA("Operation Succesfull! Please Refresh the (Page)")
      } else {
        setShowLoading(false)
      }
    } catch (error) {
      setShowLoading(false)
    }
  };

  const [previousCompetitionCount, setPreviousCompetitionCount] = useState(0)
  const [totalCompetitionCount, setTotalCompetitionCount] = useState(0)


  const fetchUpcomingAndPreviousCompetition = async () => {
    try {
      // Assuming loginId is stored in localStorage as user.id
      const user = JSON.parse(localStorage.getItem('user'));
      const loginId = user ? user.id : null;

      if (!loginId) {
        alert("User is not logged in");
        return;
      }
      // Make a GET request to the backend API
      const response = await fetch(`${apiUrl}/api/UandP/${loginId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to fetch competitions');
      }

      // Parse the JSON response
      const data = await response.json();

      setPreviousCompetitionCount(data.previousCompetitionCount);
      setTotalCompetitionCount(data.totalCompetitionCount);
      setCompetitionData2(data.previousCompetitions);

    } catch (error) {
      // console.error('Error fetching competitions:', error);
      // Handle error appropriately (e.g., show an error message to the user)
      return { previousCompetitionCount: 0, totalCompetitionCount: 0 };
    }
  };

  useEffect(() => {
    fetchUpcomingAndPreviousCompetition();
  }, [])



  return (
    <div className="tHome-main">
      {showLoading ? <Loader content={"Wait Fetching Data ..."}></Loader> : <>
        <div className="tHome-events">
          <div className="sJC-content-buttons">
            <button
              className={`sJC-button ${activeButton === "button1" && "isActive"}`}
              onClick={() => handleButtonClick("button1")}
            >
              Live Competitions
            </button>
            <button
              className={`sJC-button ${activeButton === "button2" && "isActive"}`}
              onClick={() => handleButtonClick("button2")}
            > Previous Competition
            </button>
            <button
              className={`sJC-button ${activeButton === "button3" && "isActive"}`}
              onClick={() => handleButtonClick("button3")}
            > Allowance
            </button>
          </div>
          {/* <h2>Dashboard</h2>
          <hr /> */}
          {activeButton === "button1" && (
            <div className="tHome-live-competitions">
              {competiondata.map((competition, cIndex) => (
                <div className="live-competion-card">
                  <div className="live-competion-card-img">
                    <img src={CompetitionImage} alt="" />
                  </div>
                  <div className="live-competion-card-content">
                    <h3>{competition.competitionName} </h3>
                    <div className="small_text">Rounds {competition.rounds.length}</div>
                    <p className='small_text'>{competition.lastSaved}</p>
                    <div className="live-competion-card-button">
                      <button onClick={() => copyToClipboard(competition._id)}><i className="ri-file-copy-line"></i></button>
                      <button onClick={() => openJoinModal(cIndex)}><i className="ri-earth-line"></i></button>
                      <button onClick={() => handleUnlive(competition._id)} className='live-competion-card-content-button'>Un-live <i class="ri-cloud-off-line"></i></button>
                    </div>
                  </div>

                  {isJoinModalActive && <div className="T_join_modal-overlay">
                    <div className="T_join_modal-content">
                      <div className="T_join_modal-id">
                        <h2>{competiondata[temporaryRoundIndex].competitionName}</h2>
                        <hr />
                        <div className="close-T_join_modal" onClick={closeJoinModal}>&times;</div>
                      </div>
                      <div className="available_rounds">
                        <h3>Available Rounds</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>Round</th>
                              <th>Type</th>
                              <th>Total Questions</th>
                              <th>Question Duration</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {competiondata[temporaryRoundIndex].rounds.map((round, key) => (
                              <tr key={key} className="available_rounds-details">
                                <td>{round.roundNumber}</td>
                                <td>{round.roundType}</td>
                                <td>{round.questions.length}</td>
                                <td>{round.roundDuration}</td>
                                <td><label className="edit-competition-button switch"><input type="checkbox" checked={round.isRoundLive} onChange={() => handleLiveRound(competiondata[temporaryRoundIndex]._id, round._id, round.isRoundLive)} /><span className='slider round'></span> </label></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  }
                </div>
              ))}
              {competiondata.length == 0 ? <p className='default'>No Live Competion ! Create some...</p> : <></>}
            </div>
          )}
          {activeButton === "button2" && (
            <div className="tHome-live-competitions">
              {competiondata2.map((competition, cIndex) => (
                <div className="live-competion-card">
                  <div className="live-competion-card-img">
                    <img src={CompetitionImage} alt="" />
                  </div>
                  <div className="live-competion-card-content">
                    <h3>{competition.competitionName} </h3>
                    <div className="small_text">Rounds {competition.rounds.length}</div>
                    <p className='small_text'>{competition.lastSaved}</p>
                  </div>
                </div>
              ))}
              {competiondata2.length == 0 ? <p className='default'>No Previous Competion !</p> : <></>}
            </div>
          )}
          {activeButton === "button3" && (
            <>
              <div className="thome-allowance">
                <div className="Allowance-student-list">
                  <div className="allowance competition-student-container">
                    {selectedCompetition ? (
                      <div className="allowance student-list-container">
                        <button className="allowance allowance-back-button" onClick={handleBack}>
                          <i className="ri-arrow-left-line"></i>
                        </button>
                        <h2 className="allowance student-list-heading">Enrolled Students</h2>
                        <ul className="allowance student-list">
                          {students.map((student) => (
                            <li key={student._id} className="allowance student-item">
                              <span>{student.studentName}</span>
                              <span>{student.studentEmail}</span>
                              <button onClick={() => updateAllowance(student._id)} className={`allowance ${student.allowance ? "allow-button" : "disallow-button"}`}>{student.allowance ? 'Allow' : 'Disallow'}</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="allowance-competition-cards-container">
                        {/* {competiondata.map((competition) => (
                          <div key={competition._id} className="allowance-competition-card">
                            <h3 className="allowance-competition-title">{competition.competitionName}</h3>
                            <p className="allowance-competition-description">{competition.startTiming}</p>
                            <button className="allowance-show-students-button" onClick={() => handleShowStudents(competition._id)}>
                              Show Students
                            </button>
                          </div>
                        ))} */}
                        {
                           competiondata.map((competition, index) => (
                            <div className="live-competion-card-allowance">
                              <div className="live-competion-card-img-result">
                                <img src={CompetitionImage} alt="" />
                              </div>
                              <div className="live-competion-card-content">
                                <h3>{competition.competitionName} </h3>
                                <div className="small_text">Rounds {competition.rounds.length}</div>
                                <p className='small_text'>{competition.lastSaved}</p>
                                <div className="live-competion-card-button">
                                  <button onClick={() => handleShowStudents(competition._id)}>Show students</button>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
                {competiondata.length == 0 ? <p className='default'>No Live Competion Found</p> : <></>}
              </div>
            </>
          )}
          {activeButton === "button4" && (
            <><div className="tHome-commnunity">
              <h2>Coming Soon !</h2></div></>
          )}

        </div>
        <hr className='hr' />
        <div className="tHome-analytic">
          <h2>Events Analytics</h2>
          <div className="tHome-analytics-record">
            <div className="record">
              <h2>Previous</h2>
              <div>{previousCompetitionCount}<i class="ri-checkbox-circle-line"></i></div>
            </div>
            <div className="record">
              <h2>Upcoming</h2>
              <div>{totalCompetitionCount}<i class="ri-time-line"></i></div>
            </div>
          </div>
          <div className="tHome-analytics-todo">
            <Todo></Todo>
          </div>
        </div>
      </>}
    </div>
  )
}

export default tHome