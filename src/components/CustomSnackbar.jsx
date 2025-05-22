import React, { createContext, useState, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
  const [duration, setDuration] = useState(2000);
  const [anchorOrigin, setAnchorOrigin] = useState({ vertical: 'top', horizontal: 'right' });

  const showSnackbar = (newMessage, newSeverity = 'success', newDuration = 6000, newAnchorOrigin) => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setDuration(newDuration);
    if (newAnchorOrigin) {
        setAnchorOrigin(newAnchorOrigin);
    } else {
        setAnchorOrigin({ vertical: 'top', horizontal: 'right' });
    }
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};