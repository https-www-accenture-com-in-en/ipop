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

const nonTicketCategoryOptions = ['SMC', 'SMA', 'SMT', 'SFB', 'PDM'];
const nonTicketSubCategoryMap = {
  SMC: ['AS-A0 PROCEDURES', 'AS-ACCESSIT-2.76-P', 'AS-ACCURIO PRO FLUX-P'],
  SMA: ['AS-ACHTERSTALLIGE CONTROLES VKC', 'AS-ACTION FOUNDATION TOTALENERGIES-P'],
  SMT: ['AS-ADEQUACY-P', 'AS-AEOS-P', 'AS-AGORA-P'],
  SFB: ['AS-ALARM-P', 'AS-Base Pouvoirs Groupe-P', 'AS-BDES (Base de données Economiques et Sociales)-P'],
  PDM: ['AS-BDP PLAN-1-P', 'AS-BI-CONFORMITY-IDEAL-P', 'AS-BI-KPI-TOTEM-P', 'AS-BI-TEPNO-P', 'AS-Borealis-P']
};
const nonTicketWorkItemMap = {
  'AS-A0 PROCEDURES': ['AS-A0 PROCEDURES', 'AS-ACCESSIT-2.76-P', 'AS-ACCURIO PRO FLUX-P'],
  'AS-ACHTERSTALLIGE CONTROLES VKC': ['AS-ACHTERSTALLIGE CONTROLES VKC', 'AS-ACTION FOUNDATION TOTALENERGIES-P'],
  'AS-ADEQUACY-P': ['AS-ADEQUACY-P', 'AS-AEOS-P', 'AS-AGORA-P'],
  'AS-ALARM-P': ['AS-ALARM-P', 'AS-Base Pouvoirs Groupe-P', 'AS-BDES (Base de données Economiques et Sociales)-P'],
  'AS-BDP PLAN-1-P': ['AS-BDP PLAN-1-P', 'AS-BI-CONFORMITY-IDEAL-P', 'AS-BI-KPI-TOTEM-P', 'AS-BI-TEPNO-P', 'AS-Borealis-P']
};
const taskTypeOptions = ['Development', 'Testing', 'Review', 'Documentation'];

const isValidTime = value => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);

const WorkItemCard = ({ index, data, onChange, onDelete }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    const updatedData = { ...data, [name]: value };

    // Simulated hour calculations for demo (can be dynamic based on real logic)
    if (name === 'toBook') {
      const remaining = parseFloat(updatedData.remainingHours || 0);
      const toBook = parseFloat(value || 0);
      updatedData.approvalNeeded = toBook > remaining;
    }

    onChange(index, updatedData);
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
        minWidth: 250,
        backgroundColor: 'white',
        position: 'relative'
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth required>
          <InputLabel>Select Master Project</InputLabel>
          <Select name="category" value={data.category} onChange={handleChange} label="Squad Name">
            {nonTicketCategoryOptions.map((option, i) => (
              <MenuItem key={i} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Select Sub Project</InputLabel>
          <Select
            name="subCategory"
            value={data.subCategory}
            onChange={handleChange}
            label="Business Stream"
          >
            {(nonTicketSubCategoryMap[data.category] || []).map((option, i) => (
              <MenuItem key={i} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
<Box>
          <FormControl fullWidth required>
            <InputLabel>V-Model Task</InputLabel>
            <Select name="taskType" value={data.taskType || ''} onChange={handleChange} label="Task Type">
              {taskTypeOptions.map((option, i) => (
                <MenuItem key={i} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

      {showRestFields && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Burnt Hours"
            name="burntHours"
            value={data.burntHours || '2'}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Remaining Hours"
            name="remainingHours"
            value={data.remainingHours || '3'}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Box>
      )}

      {showRestFields && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Estimated Hours"
            name="estimatedHours"
            value={data.estimatedHours || '5'}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="To Book"
            name="toBook"
            type="number"
            value={data.toBook || ''}
            onChange={handleChange}
            fullWidth
          />
        </Box>
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

      {showRestFields && data.approvalNeeded && (
        <Alert severity="warning">Approval Required: To Book is greater than Remaining Hours</Alert>
      )}

      {showRestFields && index >= 3 && (
        <IconButton onClick={() => onDelete(index)} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <DeleteIcon />
        </IconButton>
      )}
    </Paper>
  );
};

const Sipd = () => {
  const [items, setItems] = useState([
    { category: '', subCategory: '', workItem: '', taskType: '', time: '', comments: '', burntHours: '2', remainingHours: '3', estimatedHours: '5', toBook: '', approvalNeeded: false },
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
    setItems([...items, { category: '', subCategory: '', workItem: '', taskType: '', time: '', comments: '', burntHours: '2', remainingHours: '3', estimatedHours: '5', toBook: '', approvalNeeded: false }]);
  };

  const handleDeleteItem = index => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const isItemValid = item =>
    item.category &&
    item.subCategory &&
    item.workItem &&
    item.taskType &&
    item.comments.trim() !== '' &&
    item.toBook !== '';

  const handleSave = () => {
    const validItems = items.filter(isItemValid);

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
      <Typography variant="h6" mb={2}></Typography>

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
        <Button variant="contained" color="success" onClick={handleSave}>Save / Send Approval</Button>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} sx={{ width: '100%' }}>{alert.message}</Alert>
      </Snackbar>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Saved Data</DialogTitle>
        <DialogContent dividers>
          {savedData.map((item, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1"><strong>Entry {index + 1}</strong></Typography>
              <Typography>Category: {item.category}</Typography>
              <Typography>Sub Category: {item.subCategory}</Typography>
              <Typography>Work Item: {item.workItem}</Typography>
              <Typography>Task Type: {item.taskType}</Typography>
              <Typography>Burnt: {item.burntHours}, Remaining: {item.remainingHours}, Estimated: {item.estimatedHours}, To Book: {item.toBook}</Typography>
              <Typography>Comments: {item.comments}</Typography>
              {item.approvalNeeded && (
                <Alert severity="info">
                  Approval Requested: {item.toBook} - {item.remainingHours} = {(item.toBook - item.remainingHours).toFixed(2)} hours
                </Alert>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary" variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sipd;
