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

//    await axios.post(
//   `http://localhost:5000/addGuiwithSequence/`,
//   { gui_type: uiType,
//     master_work_types: names.map((item) => item.name),
//     sequences: names.map((item) => item.sequence),
//   }
// );
    console.log("data saved");
  };

  return (
    <>
    <div style={{marginTop:"20px" , border:"1px solid #7500c0" , borderRadius:"10px" , paddingTop:"20px" , paddingLeft:"60px" , paddingRight:"60px" , paddingBottom:"20px"}} >
      <DropdownWithTextBox allNames={allNames} setAllNames={setAllNames} setUiType={setUiType} setSequence={setSequence} setSelectedName={setSelectedName} label={"Create Master Work Types: "} />
      <br />
      <div style={{marginTop:"0px"}} >   
        {/* <MappedDropdown
          workTypes={workTypes}
          setWorkTypes={setWorkTypes}
          uiType={uiType}
          selectedName={selectedName}
          setSelectedName={setSelectedName}
        /> */}

         <DropdownWithTextBox allNames={allNames} setAllNames={setAllNames} setUiType={setUiType} setSequence={setSequence} setSelectedName={setSelectedName} label={"Create Delivery Work Types: "} />
      </div>
        <div style={{marginTop:"20px"}} >
          <label htmlFor="uiTypeSelect" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                UI Type For Master Work Types
              </label>
              <select
                id="uiTypeSelect"
                style={{  width: '100%', padding: '8px 60px 8px 8px', boxSizing: 'border-box'  }}
                onChange={e => setUiType(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select a GUI Type…</option>
                <option value="check_box">Check Box</option>
                <option value="radio_button">Radio Button</option>
                <option value="button">Button</option>
              </select>
          </div>
        <button
          onClick={handleNext}
          style={{
             padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            border: 'none',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '4px',
            marginTop: '20px',
            backgroundColor: '#eb7476',
          }}
        >
          Save
        </button>
      </div>
    </>
  )
};

export default FieldRow;
