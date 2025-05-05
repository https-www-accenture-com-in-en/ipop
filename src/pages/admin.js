import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";

const fieldTypes = ["checkbox", "radio", "dropdown", "textField"];

const getFieldComponent = (field, fieldIndex, handleFieldChange) => {
  switch (field.type) {
    case "checkbox":
    case "radio":
      return (
        <TextField
          label="Work Type"
          value={field.label || ""}
          onChange={(e) => handleFieldChange(fieldIndex, { label: e.target.value })}
          fullWidth
          margin="normal"
        />
      );
    case "textField":
      return (
        <TextField
          label="Groupname"
          value={field.label || ""}
          onChange={(e) => handleFieldChange(fieldIndex, { label: e.target.value })}
          fullWidth
          margin="normal"
        />
      );
    case "dropdown":
      return (
        <>
          <TextField
            label="Category"
            value={field.category || ""}
            onChange={(e) => handleFieldChange(fieldIndex, { category: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sub-category (comma separated)"
            value={field.subCategory || ""}
            onChange={(e) => handleFieldChange(fieldIndex, { subCategory: e.target.value })}
            fullWidth
            margin="normal"
          />
        </>
      );
    default:
      return null;
  }
};

const FormBlock = ({ index, data, handleBlockChange }) => {
  const handleAddFieldClick = () => {
    const updatedFields = [...(data.fields || []), { type: "" }];
    handleBlockChange(index, { ...data, fields: updatedFields });
  };

  const handleFieldTypeChange = (fieldIndex, type) => {
    const updatedFields = [...data.fields];
    updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], type };
    handleBlockChange(index, { ...data, fields: updatedFields });
  };

  const handleFieldChange = (fieldIndex, changes) => {
    const updatedFields = [...data.fields];
    updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], ...changes };
    handleBlockChange(index, { ...data, fields: updatedFields });
  };

  return (
    <Box border={1} borderRadius={2} padding={2} margin={1} width={"100%"}>
      
      {(data.fields || []).map((field, fieldIndex) => (
        <Box key={fieldIndex} marginTop={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Field Type</InputLabel>
            <Select
              value={field.type || ""}
              onChange={(e) => handleFieldTypeChange(fieldIndex, e.target.value)}
              label="Select Field Type"
            >
              {fieldTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {getFieldComponent(field, fieldIndex, handleFieldChange)}
        </Box>
      ))}
      <Button variant="outlined" onClick={handleAddFieldClick}>
        Add Field
      </Button>
    </Box>
  );
};

const DynamicFormUI = () => {
  const [blocks, setBlocks] = useState([{ fields: [] }]);

  const addBlock = () => {
    setBlocks([...blocks, { fields: [] }]);
  };

  const handleBlockChange = (index, updatedBlock) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = updatedBlock;
    setBlocks(updatedBlocks);
  };

  const handleSave = () => {
    console.log("All Field Data:", blocks);
  };
  return (
    <Box padding={4}>
      <Grid container spacing={2}>
        {blocks.map((block, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FormBlock index={index} data={block} handleBlockChange={handleBlockChange} />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button variant="contained" onClick={addBlock} sx={{ marginRight: 2 }}>
          Add Block
        </Button>
        <Button variant="contained" color="success" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicFormUI;
