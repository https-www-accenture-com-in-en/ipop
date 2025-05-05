import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
 
const users = [
  { eid: 'john.doe', password: 'password123' },
  { eid: 'jane.smith', password: 'mypassword' },
  { eid: 'enterprise.user', password: 'securepass' },
];
 
const securityQuestions = [
  "What is your pet's name?",
  "What is your mother's maiden name?",
  "What was your first school's name?"
];
 
function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [eid, setEid] = useState('');
  const [eidError, setEidError] = useState('');
  const [isEidValidated, setIsEidValidated] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
 
  const handleEidSubmit = () => {
    if (!eid) {
      setEidError('Enterprise ID is required.');
      return;
    }
    const userExists = users.find(user => user.eid === eid);
    if (!userExists) {
      setEidError('Enterprise ID not found.');
      return;
    }
    setIsEidValidated(true);
    setEidError('');
  };
 
  const handleFinalSubmit = () => {
    if (!selectedQuestion || !answer) {
      alert('Please select a question and provide an answer.');
      return;
    }
    alert('Your answer has been submitted. Reset instructions will be sent!');
    navigate('/');
  };
 
  const handleReset = () => {
    setSelectedQuestion('');
    setAnswer('');
  };
 
  const handleGoToLogin = () => {
    navigate('/');
  };
 
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>Forgot Password</Typography>
 
        <TextField
          fullWidth
          margin="normal"
          label="Enterprise ID"
          value={eid}
          onChange={(e) => setEid(e.target.value)}
          error={Boolean(eidError)}
          helperText={eidError}
          disabled={isEidValidated}
        />
 
        {!isEidValidated && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleEidSubmit}
          >
            Submit
          </Button>
        )}
       
 
        <Button
          variant="text"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleGoToLogin}
        >
          Go to Login Page
        </Button>
 
        {isEidValidated && (
          <>
            <FormControl fullWidth sx={{ mt: 4 }}>
              <InputLabel id="question-label">Security Question</InputLabel>
              <Select
                labelId="question-label"
                value={selectedQuestion}
                label="Security Question"
                onChange={(e) => setSelectedQuestion(e.target.value)}
              >
                {securityQuestions.map((q, idx) => (
                  <MenuItem key={idx} value={q}>{q}</MenuItem>
                ))}
              </Select>
            </FormControl>
 
            <TextField
              fullWidth
              margin="normal"
              label="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              sx={{ mt: 2 }}
            />
 
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleFinalSubmit}
            >
              Submit
            </Button>
 
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
 
export default ForgotPasswordPage;
 
 