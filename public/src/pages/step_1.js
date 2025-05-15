import React, { useState } from 'react';
import DropdownWithTextBox from './DropDown.tsx';
import MappedDropdown from './MappedDropdown.tsx';
import axios from 'axios';

const FieldRow = () => { 
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState('');
  const [workTypes, setWorkTypes] = useState('');
  const [sequence, setSequence] = useState('');
  const [allNames, setAllNames] = useState([]);

const names = allNames.map((name, index) => ({
  name,
  sequence: index + 1
}));

  const handleNext = async () => {

   await axios.post(
  `http://localhost:5000/addGuiwithSequence/`,
  { gui_type: uiType,
    master_work_types: names.map((item) => item.name),
    sequences: names.map((item) => item.sequence),
  }
);
  };

  return (
    <>
      <DropdownWithTextBox allNames={allNames} setAllNames={setAllNames} setUiType={setUiType} setSequence={setSequence} setSelectedName={setSelectedName} />
      <br /><br /><br /><br/><br /><br /><br />

      {selectedName && uiType ? (
        <MappedDropdown
          workTypes={workTypes}
          setWorkTypes={setWorkTypes}
          uiType={uiType}
          selectedName={selectedName}
          setSelectedName={setSelectedName}
        />
      ) : null}

      <br /><br /><br /><br /><br />

      {selectedName && workTypes && (
        <button
          onClick={handleNext}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      )}
    </>
  )
};

export default FieldRow;
