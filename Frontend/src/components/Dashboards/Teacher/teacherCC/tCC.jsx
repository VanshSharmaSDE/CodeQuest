import React, { useState } from 'react';
import CreateCompetition from '../CreateCompetition';
import EditCompetition from '../EditCompetition';

function tCC() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompNameIndex, setSelectedCompNameIndex] = useState(0);
  const [selectedCompName, setSelectedCompName] = useState('');

  // Function to switch to EditCompetition component
  const handleEditCompetition = (compName, index) => {
    setSelectedCompName(compName);
    setIsEditing(true);
    setSelectedCompNameIndex(index);
  };

  // Function to switch back to CreateCompetition component
  const handleBackToCreate = () => {
    setIsEditing(false);
    setSelectedCompName('');
  };

  return (
    <div>
      {isEditing ? (
        <EditCompetition compName={selectedCompName} onBack={handleBackToCreate} index={selectedCompNameIndex}/>
      ) : (
        <CreateCompetition onEditCompetition={handleEditCompetition} />
      )}
    </div>
  );
}

export default tCC;
