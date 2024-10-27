import React, { useEffect, useState, useContext } from "react";
import SavedCompetitions from "./SavedCompetitions";
import EditSavedCompetitions from "./EditSavedCompetitions";
import { CompetitionContext } from "../../../../context/T_D2_CompetitionContext";
import Loader from "../../../../utilities/Loader/Loader";


function tSC() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompNameIndex, setSelectedCompNameIndex] = useState(0);
  const [showLoading, setShowLoading] = useState(false)

  // Function to switch to EditCompetition component
  const handleEditCompetition = (index) => {
    setIsEditing(true);
    setSelectedCompNameIndex(index);
    setDisableSave(true)
  };

  // Function to switch back to CreateCompetition component
  const handleBackToCreate = () => {
    setIsEditing(false);
  };


  const {
    setSavedCompetitions,
    setDisableSave
  } = useContext(CompetitionContext)

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
        `${apiUrl}/api/getcompetition/${loginId}`,
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
        setSavedCompetitions(data)  // storing the data fetched from redux to a state variable to perform various operations
      } else {
        // Handle the case where the response status is not 200-299
        const errorData = await response.json();
        setShowLoading(false)
      }
    } catch (error) {
      console.log(error)
      setShowLoading(false)
    }
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <>
      {showLoading ? <Loader content={"Wait Fetching All Saved Competitions"}></Loader> : <>{isEditing
        ? <EditSavedCompetitions onBack={handleBackToCreate} index={selectedCompNameIndex} />
        : <SavedCompetitions onEditCompetition={handleEditCompetition} />
      }</>}
    </>
  );
}

export default tSC;