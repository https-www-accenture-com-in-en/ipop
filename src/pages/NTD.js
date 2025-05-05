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
 
const workItemOptions = [
  'Domain Lead Activities',
  'GDL Activities',
  'SNO Integration Activities',
  'SR & CSM',
  'Meetings',
  'Support Operations'
];
 
const categoryOptions = [
  'Planning',
  'Execution',
  'Review',
  'Reporting'
];
 
// Time format validator
const isValidTime = (value) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
 
const WorkItemCard = ({ index, data, onChange, onDelete }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...data, [name]: value });
  };
 
  const showRestFields = !!data.workItem;
 
  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        m: 1,
        minWidth: showRestFields ? 300 : 200,
        width: showRestFields ? 300 : 100,
        height: showRestFields ? 'auto' : 100,
        backgroundColor: 'white',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Work Item Dropdown */}
      <FormControl required sx={{ minWidth: 100 }}>
        <InputLabel>Work Item</InputLabel>
        <Select
          name="workItem"
          value={data.workItem}
          onChange={handleChange}
          label="Work Item"
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          {workItemOptions.map((option, i) => (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
 
      {/* Category Dropdown */}
      {showRestFields && (
        <FormControl required sx={{ minWidth: 100 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={data.category}
            onChange={handleChange}
            label="Category"
            sx={{ backgroundColor: '#f5f5f5' }}
          >
            {categoryOptions.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
 
      {/* Time Input */}
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
          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
        />
      )}
 
      {/* Comments */}
      {showRestFields && (
        <TextField
          label="Comments"
          name="comments"
          value={data.comments}
          onChange={handleChange}
          required
          multiline
          minRows={2}
          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
        />
      )}
 
      {/* Delete Button */}
      {showRestFields && index >= 3 && (
        <IconButton
          onClick={() => onDelete(index)}
          sx={{ position: 'absolute', top: 250, right: 10 }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Paper>
  );
};
 
const NTD = () => {
  const [items, setItems] = useState([
    { workItem: '', category: '', time: '', comments: '' },
    { workItem: '', category: '', time: '', comments: '' },
    { workItem: '', category: '', time: '', comments: '' }
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
    setItems([...items, { workItem: '', category: '', time: '', comments: '' }]);
  };
 
  const handleDeleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };
 
  const isItemFilledAndValid = (item) => {
    return (
      item.workItem &&
      item.category &&
      isValidTime(item.time) &&
      item.comments.trim() !== ''
    );
  };
 
  const handleSave = () => {
    const validItems = items.filter(isItemFilledAndValid);
    const hasInvalidTime = items.some(item => item.time && !isValidTime(item.time));
 
    if (hasInvalidTime) {
      setAlert({
        open: true,
        message: '❌ One or more entries have invalid time format!',
        severity: 'error'
      });
      return;
    }
 
    if (validItems.length === 0) {
      setAlert({
        open: true,
        message: '❌ Please fill at least one full card before saving.',
        severity: 'error'
      });
      return;
    }
 
    setSavedData(validItems);
    setShowDialog(true);
 
    setAlert({
      open: true,
      message: '✅ Successfully saved!',
      severity: 'success'
    });
 
    console.log('Saved data:', validItems);
  };
 
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" mb={2}>NTD</Typography>
 
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
        <DialogTitle>Saved Successfully ✅</DialogTitle>
        <DialogContent dividers>
          {savedData.map((item, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1"><strong>Entry {index + 1}</strong></Typography>
              <Typography>Work Item: {item.workItem}</Typography>
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
 
export default NTD;
 
 