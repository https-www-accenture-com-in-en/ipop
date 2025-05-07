import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Paper,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const nonTicketCategoryOptions = [
  'Casual Leave',
  'Paid Leave',
  'Sick Leave',
  'Public Holiday',
  'Optional Holiday'
];


const isValidTime = (value) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);

const WorkItemCard = ({ index, data, onChange, onDelete }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...data, [name]: value });
  };

  const showRestFields = !!data.category;

  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        m: 1,
        minWidth: 300,
        backgroundColor: 'white',
        position: 'relative'
      }}
    >
      <FormControl required fullWidth variant="outlined">
        <InputLabel shrink>Type of Leave</InputLabel>
        <Select
          name="category"
          value={data.category}
          onChange={handleChange}
          label="Non Ticket Delivery Work Category"
          notched
        >
          {nonTicketCategoryOptions.map((option, i) => (
            <MenuItem key={i} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {showRestFields && (
        <TextField
          label="Time (HH:MM)"
          name="time"
          value={data.time}
          onChange={handleChange}
          required
          placeholder="e.g., 01:30"
          error={data.time && !isValidTime(data.time)}
          helperText={
            data.time && !isValidTime(data.time)
              ? 'Please enter time in HH:MM 24-hour format'
              : ''
          }
        />
      )}

      {showRestFields && (
        <TextField
          label="Comments"
          name="comments"
          value={data.comments}
          onChange={handleChange}
          required
          multiline
          minRows={2}
        />
      )}

      {showRestFields && index >= 3 && (
        <IconButton
          onClick={() => onDelete(index)}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Paper>
  );
};

const Timeoff = () => {
  const [items, setItems] = useState([
    { category: '', time: '', comments: '' },
    { category: '', time: '', comments: '' },
    { category: '', time: '', comments: '' }
  ]);

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [savedData, setSavedData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const handleItemChange = (index, newData) => {
    const updated = [...items];
    updated[index] = newData;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { category: '',time: '', comments: '' }]);
  };

  const handleDeleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const isItemValid = (item) => {
    return (
      item.category &&
      isValidTime(item.time) &&
      item.comments.trim() !== ''
    );
  };

  const handleSave = () => {
    const validItems = items.filter(isItemValid);
    const hasInvalidTime = items.some(item => item.time && !isValidTime(item.time));

    if (hasInvalidTime) {
      setAlert({ open: true, message: 'Invalid time format in one or more items', severity: 'error' });
      return;
    }

    if (validItems.length === 0) {
      setAlert({ open: true, message: 'Please complete at least one valid entry.', severity: 'error' });
      return;
    }

    setSavedData(validItems);
    setShowDialog(true);
    setAlert({ open: true, message: 'Data saved successfully!', severity: 'success' });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" mb={2}>Time Off</Typography>

      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
        {items.map((item, index) => (
          <WorkItemCard
            key={index}
            index={index}
            data={item}
            onChange={handleItemChange}
            onDelete={handleDeleteItem}
          />
        ))}
      </Box>

      <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleAddItem}>Add Item</Button>
        <Button variant="contained" color="success" onClick={handleSave}>Save</Button>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Saved Data</DialogTitle>
        <DialogContent dividers>
          {savedData.map((item, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1"><strong>Entry {index + 1}</strong></Typography>
              <Typography>Category: {item.category}</Typography>
              <Typography>Time: {item.time}</Typography>
              <Typography>Comments: {item.comments}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timeoff;
