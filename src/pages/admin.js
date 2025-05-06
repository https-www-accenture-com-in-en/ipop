
import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper
} from '@mui/material';
import MultiSelectWithAdd from './step_1';
import Step_2 from './step_2';

const steps = [
  'Create Master Work Types',
  'Delivery Work Types',
  'Delivery Work Type Categories',
  'Create Ticket Delivery',
  'Create Non Ticket Delivery',
  'Create Non Ticket Non Delivery',
  'Application Development Projects'
];

const StepContent = ({ step,onSaveSuccess }) => {
  switch (step) {
    case 0:
      return <MultiSelectWithAdd onSaveSuccess={onSaveSuccess} />
    case 1:
      return  <Step_2/> 
    case 2:
      return <Typography>Step 3: Assign Roles</Typography>;
    case 3:
      return <Typography>Step 4: Configure Forms</Typography>;
    case 4:
      return <Typography>Step 5: Review Fields</Typography>;
    case 5:
      return <Typography>Step 6: Map Workflows</Typography>;
    case 6:
      return <Typography>Step 7: Assign Permissions</Typography>;
    case 7:
      return <Typography>Step 8: Finalize & Submit</Typography>;
    default:
      return <Typography>Unknown step</Typography>;
  }
};

const DynamicFormUI = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [step,setStep] = useState(0);
 

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleSaveSuccess = () => {
    setStep(1); 
    handleNext(); 
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%', padding: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h6" gutterBottom>
              All steps completed!
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </>
        ) : (
          <>
            <StepContent step={activeStep} onSaveSuccess={handleSaveSuccess}/>
            <Box sx={{ marginTop: 2 }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 2 }}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}; 

export default DynamicFormUI;

