import React, { useState } from 'react';
import DropdownWithTextBox from './DropDown';
import { Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
 
const FieldRow = () => {
  const [masterWorkType, setMasterWorkType] = useState('');
  const [deliveryWorkTypes, setDeliveryWorkTypes] = useState([]);
  const [uiType, setUiType] = useState('');
  const [sequence, setSequence] = useState('');
 
  const handleNext = () => {
    const savedData = {
      masterWorkType,
      uiType,
      deliveryWorkTypes,
    };
 
    console.log('Data saved locally:');
    console.log('UI Type:', savedData.uiType);
    console.log('Master Work Types:', savedData.masterWorkType);
    console.log('Delivery Work Types:', savedData.deliveryWorkTypes);
  };
 
  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <div
          style={{
            border: '1px solid #7500c0',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <DropdownWithTextBox
            allNames={masterWorkType ? [masterWorkType] : []}
            setAllNames={(newList) => setMasterWorkType(newList[0] || '')}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={setMasterWorkType}
            label={'Create Master Work Types: '}
            singleEntry
          />
 
          <br />
 
          <DropdownWithTextBox
            allNames={deliveryWorkTypes}
            setAllNames={setDeliveryWorkTypes}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={() => {}}
            label={'Create Delivery Work Types: '}
          />
        </div>
 
        <div style={{ marginTop: "10px" }} >
        <label htmlFor="uiTypeSelect" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          UI Type For Master Work Types
        </label>
        <select
          id="uiTypeSelect"
          style={{ width: '100%', padding: '8px 60px 8px 8px', boxSizing: 'border-box' }}
          onChange={e => setUiType(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select a GUI Type…</option>
          <option value="check_box">Check Box</option>
          <option value="radio_button">Radio Button</option>
          <option value="button">Button</option>
        </select>
      </div>


 
        <Button
          onClick={handleNext}
          variant="contained"
          sx={{
            mt: 2,
            px: 2,
            py: 1,
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '6px',
            backgroundColor: '#eb7476',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#f38b8d',
              transform: 'scale(1.05)',
            },
          }}
        >
          SAVE
        </Button>
      </div>
    </>
  );
};
 
export default FieldRow;