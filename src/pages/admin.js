
import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Grid
} from '@mui/material';
import Step_1 from './step_1';
import Step_2 from './step_2';
import Step_4 from './step_4';
import Step_3 from './step_3';

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
      return <Step_1 onSaveSuccess={onSaveSuccess} />
    case 1:
      return  <Step_2/> 
    case 2:
      return <Step_3/>;
    case 3:
      return <Step_4/>
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
    <Box sx={{ width: '100%'}}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
   <Grid container>
   <Grid size={4}>
      <Paper  elevation={3} sx={{ padding: 3, marginTop: 4 }}>
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
      </Grid>
   </Grid>
    </Box>
  );
}; 

export default DynamicFormUI;

