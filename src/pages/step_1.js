import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Grid,
} from '@mui/material';

const FieldRow = ({ index, field, handleInputChange }) => {
  return (
    <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Create Master Work Type"
          value={field.name}
          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth sx={{minWidth:120}} >
          <InputLabel>Type</InputLabel>
          <Select
          fullWidth
            value={field.type}
            label="Type"
            onChange={(e) => handleInputChange(index, 'type', e.target.value)}
            aria-placeholder='type'
          >
            <MenuItem value="checkbox">Checkbox</MenuItem>
            <MenuItem value="radio">Radio</MenuItem>
            <MenuItem value="button">Button</MenuItem>
            <MenuItem value="button">Dropdown</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

const DynamicFields = ({onSaveSuccess}) => {
  const [fields, setFields] = useState([{ name: '', type: '',sequence:0,step:1 }]);
  

  const handleAddField = () => {
    setFields([...fields, { name: '', type: '',sequence:0 }]);
  };

  const handleInputChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSave = () => {
    // Simulate save logic
    const response = 'Success'; // Assume this comes from your actual logic
    console.log(fields,"fields")
    if (response === 'Success') {
      alert('Saved successfully');
      onSaveSuccess();
    }
  };
  return (
    <Box sx={{ p: 4 }}>
      {fields.map((field, index) => (
        <FieldRow
          key={index}
          index={index}
          field={field}
          handleInputChange={handleInputChange}
        />
      ))}

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleAddField}>
          Add Field
        </Button>
        <Button variant="outlined" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicFields;
