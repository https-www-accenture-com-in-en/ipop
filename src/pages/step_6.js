import React, { useState } from 'react';
import DropdownWithTextBox from './DropDown.js';
import { Button, MenuItem, Select, InputLabel, FormControl, Box, TextField } from '@mui/material';
 
const FieldRow = () => {
  
  const [workTypeCategory, setWorkTypeCategory] = useState(["Non Delivery"]);
  const [workCategory, setWorkCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [workItem, setWorkItem] = useState([]);
  const [selectedTaskType, setSelectedTaskType] = useState();
  const [uiType, setUiType] = useState('');
  const [sequence, setSequence] = useState('');
  
 
const savedData = {
      workTypeCategory,
      selectedTaskType,
      workCategory,
      subCategory,
      workItem
    };

    const taskTypeOptions = ["TaskType1","TaskType2"];

 
 
  const handleNext = () => {
 
    console.log('UI Type:', savedData.uiType);
   
  };
 
   const handleSave = () => {
 
    console.log('Data saved locally:');
     console.log(savedData);
    
  };
 
  return (
    <>
      <div style={{ marginTop: '20px'  }}>
        <div
          style={{
            border: '1px solid #7500c0',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            alignContent:'center',
            flexDirection: 'column',
            
            
          }}
        >

            <label htmlFor="ticketNumberInput" style={{ display: 'block', marginBottom: 0, fontWeight: 'bold' }}>
        WorkTypeCategory
      </label>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
        <TextField
          
          value={workTypeCategory}
          onChange={(e) => setWorkTypeCategory(e.target.value)}
          fullWidth
        />
      </Box>

      <br/>

      <label htmlFor="nameInput" style={{ display: 'block',marginBottom: '4',  fontWeight: 'bold' }}>
              Task Type
            </label>
              <FormControl  fullWidth sx={{ maxWidth: '100%'}}>
                <InputLabel>Select Task Type</InputLabel>
                <Select
                  value={selectedTaskType}
                  onChange={(e) => setSelectedTaskType(e.target.value)}
                  label="Ticket Type"
                >
                  {taskTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>

                
              </FormControl>

              <br/>
          <DropdownWithTextBox
            allNames={workCategory}
            setAllNames={setWorkCategory}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={setSelectedName}
            label={'Create Non Ticket Delivery Work Category: '}
            
          />
 
          <br />
 
          <DropdownWithTextBox
            allNames={subCategory}
            setAllNames={setSubCategory}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={() => {}}
            label={'Create Non Ticket Delivery Work Sub-Category: '}
            
          />

          <br/>

          <DropdownWithTextBox
            allNames={workItem}
            setAllNames={setWorkItem}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={() => {}}
            label={'Create Non Ticket Delivery Work Item: '}
            
          />

          <Button
          onClick={handleNext}
          variant="contained"
          sx={{
            mt: 0.5,
            px: 0.5,
            py: 0.5,
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '6px',
            backgroundColor: '#7500c0',
            color: 'white',
            width: '100%',
            marginTop: '10px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#7500c0',
              transform: 'scale(1.05)',
            },
          }}
        >
          Save
        </Button>
   
 
        </div>

        
      </div>
    </>
  );
};
 
export default FieldRow;